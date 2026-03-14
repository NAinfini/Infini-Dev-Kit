import type { BotEventHandler } from "./adapter-types";
import { createCommandRouter, type CommandDefinition } from "./command-router";
import { composeMiddleware, type BotContext, type Middleware } from "./middleware";
import { toError } from "@infini-dev-kit/utils/error";

export interface UnifiedBotOptions {
  adapter: import("./adapter-types").BotAdapter;
  middlewares?: Middleware[];
  commands?: CommandDefinition[];
  commandPrefix?: string;
}

export type BotPluginCleanup = () => void | Promise<void>;
export type BotPlugin = (bot: UnifiedBot) => void | BotPluginCleanup;

export interface UnifiedBot {
  readonly adapter: import("./adapter-types").BotAdapter;
  use(middleware: Middleware): void;
  use(plugin: BotPlugin): void;
  command(definition: CommandDefinition): void;
  start(): Promise<void>;
  stop(): Promise<void>;
}

function isMiddleware(value: Middleware | BotPlugin): value is Middleware {
  return value.length >= 2;
}

export function createBot(options: UnifiedBotOptions): UnifiedBot {
  const middlewares: Middleware[] = [...(options.middlewares ?? [])];
  const pluginCleanups: BotPluginCleanup[] = [];
  let cachedPipeline: Middleware | null = null;

  const router = createCommandRouter({
    prefix: options.commandPrefix,
  });

  for (const definition of options.commands ?? []) {
    router.register(definition);
  }

  const getPipeline = (): Middleware => {
    if (!cachedPipeline) {
      cachedPipeline = composeMiddleware([...middlewares, router.middleware]);
    }

    return cachedPipeline;
  };

  const onMessage: BotEventHandler<"message"> = async (message) => {
    const context: BotContext = {
      message,
      adapter: options.adapter,
      state: new Map<string, unknown>(),
    };

    await getPipeline()(context, async () => Promise.resolve());
  };

  let attached = false;
  let botApi: UnifiedBot;

  botApi = {
    adapter: options.adapter,
    use(extension) {
      if (isMiddleware(extension)) {
        middlewares.push(extension);
        cachedPipeline = null;
        return;
      }

      const cleanup = extension(botApi);
      if (typeof cleanup === "function") {
        pluginCleanups.push(cleanup);
      }
    },
    command(definition) {
      router.register(definition);
    },
    async start() {
      if (!attached) {
        options.adapter.on("message", onMessage);
        attached = true;
      }
      await options.adapter.start();
    },
    async stop() {
      let cleanupError: Error | undefined;
      while (pluginCleanups.length > 0) {
        const cleanup = pluginCleanups.pop();
        if (!cleanup) {
          continue;
        }

        try {
          await cleanup();
        } catch (error) {
          cleanupError ??= toError(error);
        }
      }

      if (attached) {
        options.adapter.off("message", onMessage);
        attached = false;
      }
      await options.adapter.stop();

      if (cleanupError) {
        throw cleanupError;
      }
    },
  };

  return botApi;
}
