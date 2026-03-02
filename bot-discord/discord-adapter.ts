import {
  createBaseAdapter,
  type AdapterReconnectOptions,
  type BotAdapter,
} from "../bot-core";
import type { BotConversation } from "../bot-core/conversation-types";
import type { BotUser } from "../bot-core/user-types";
import { LRUMap } from "../utils/lru-map";
import { toError } from "../utils/error";
import {
  isSlashCommandInteraction,
  toDiscordCommandPayload,
  type DiscordAdapterExtended,
  type DiscordInteraction,
  type SlashCommandDefinition,
} from "./discord-commands";
import { mapDiscordChannel, type DiscordChannelLike } from "./discord-conversation";
import { mapDiscordMessage, type DiscordMessageLike } from "./discord-message";
import { mapDiscordUser, type DiscordUserLike } from "./discord-user";

export interface DiscordApplicationLike {
  commands?: {
    set?: (commands: unknown[]) => Promise<unknown>;
  };
}

export interface DiscordClientLike {
  login: (token: string) => Promise<unknown>;
  destroy: () => Promise<unknown> | void;
  on: (event: string, handler: (...args: unknown[]) => void | Promise<void>) => void;
  off?: (event: string, handler: (...args: unknown[]) => void | Promise<void>) => void;
  user?: DiscordUserLike;
  application?: DiscordApplicationLike;
  channels?: {
    fetch?: (id: string) => Promise<DiscordChannelLike | undefined>;
  };
  users?: {
    fetch?: (id: string) => Promise<DiscordUserLike | undefined>;
  };
}

export interface DiscordAdapterOptions {
  token: string;
  intents?: unknown[];
  clientOptions?: Record<string, unknown>;
  clientFactory?: () => DiscordClientLike;
  cacheSize?: {
    conversations?: number;
    users?: number;
  };
  reconnect?: AdapterReconnectOptions;
}

const DEFAULT_CONVERSATION_CACHE_SIZE = 500;
const DEFAULT_USER_CACHE_SIZE = 3000;
const DEFAULT_RECONNECT = {
  enabled: true,
  maxAttempts: 10,
  baseDelayMs: 1_000,
  maxDelayMs: 30_000,
} satisfies Required<AdapterReconnectOptions>;

export const DISCORD_ADAPTER_RAW = Symbol("discord-adapter-raw");

interface DiscordAdapterWithRaw extends DiscordAdapterExtended {
  [DISCORD_ADAPTER_RAW]?: DiscordClientLike;
}

function createNoopDiscordClient(): DiscordClientLike {
  return {
    async login() {
      return "";
    },
    async destroy() {},
    on() {},
  };
}

function toDisconnectReason(reason: unknown): string {
  if (typeof reason === "string" && reason.trim()) {
    return reason;
  }

  if (reason && typeof reason === "object") {
    const reasonWithCode = reason as { code?: unknown; toString?: () => string };
    if (reasonWithCode.code !== undefined) {
      return `code:${String(reasonWithCode.code)}`;
    }

    if (typeof reasonWithCode.toString === "function") {
      const text = reasonWithCode.toString();
      if (text && text !== "[object Object]") {
        return text;
      }
    }
  }

  return "unknown";
}

export function createDiscordAdapter(options: DiscordAdapterOptions): BotAdapter {
  const client = options.clientFactory?.() ?? createNoopDiscordClient();
  const conversationCacheSize = options.cacheSize?.conversations ?? DEFAULT_CONVERSATION_CACHE_SIZE;
  const userCacheSize = options.cacheSize?.users ?? DEFAULT_USER_CACHE_SIZE;
  const reconnect = {
    ...DEFAULT_RECONNECT,
    ...options.reconnect,
  };

  const conversationCache = new LRUMap<string, BotConversation>(conversationCacheSize);
  const userCache = new LRUMap<string, BotUser>(userCacheSize);
  const interactionHandlers = new Set<(interaction: DiscordInteraction) => Promise<void> | void>();
  const slashCommands = new Map<string, SlashCommandDefinition>();

  const initialSelf: BotUser = {
    id: "discord-self",
    name: "discord-bot",
    platform: "discord",
    raw: null,
    async send() {
      throw new Error("Cannot DM self user without a concrete API user");
    },
  };

  const { adapter: coreAdapter, runtime } = createBaseAdapter({
    platform: "discord",
    client,
    initialSelf,
    startClient: async (activeClient) => {
      await activeClient.login(options.token);
    },
    stopClient: async (activeClient) => {
      await activeClient.destroy();
    },
    conversationCache,
    userCache,
    fetchConversation: async (activeClient, id, adapter) => {
      const channel = await activeClient.channels?.fetch?.(id);
      if (!channel) {
        return undefined;
      }

      return mapDiscordChannel(channel, adapter);
    },
    fetchUser: async (activeClient, id, adapter) => {
      const user = await activeClient.users?.fetch?.(id);
      if (!user) {
        return undefined;
      }

      return mapDiscordUser(user, adapter);
    },
  });

  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let reconnectAttempt = 0;
  let reconnectScheduled = false;
  let stopping = false;

  const clearReconnectTimer = (): void => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = undefined;
    }
  };

  const scheduleReconnectAttempt = (): void => {
    if (!reconnect.enabled || stopping) {
      reconnectScheduled = false;
      return;
    }

    reconnectAttempt += 1;
    if (reconnectAttempt > reconnect.maxAttempts) {
      reconnectScheduled = false;
      runtime.emit("error", new Error("Discord adapter reconnect attempts exhausted"));
      return;
    }

    runtime.emit("reconnecting", reconnectAttempt);
    const delayMs = Math.min(
      reconnect.maxDelayMs,
      reconnect.baseDelayMs * Math.pow(2, reconnectAttempt - 1),
    );

    reconnectTimer = setTimeout(() => {
      reconnectTimer = undefined;
      if (stopping) {
        reconnectScheduled = false;
        return;
      }

      void coreAdapter.start()
        .then(() => {
          reconnectScheduled = false;
          reconnectAttempt = 0;
          runtime.emit("reconnected");
        })
        .catch((error) => {
          runtime.emit("error", toError(error));
          scheduleReconnectAttempt();
        });
    }, delayMs);

    const nodeTimer = reconnectTimer as { unref?: () => void };
    if (typeof nodeTimer.unref === "function") {
      nodeTimer.unref();
    }
  };

  const handleDisconnect = (reason: unknown): void => {
    runtime.setRunning(false);
    const formattedReason = toDisconnectReason(reason);
    runtime.emit("disconnect", formattedReason);

    if (!reconnect.enabled || reconnectScheduled || stopping) {
      return;
    }

    reconnectScheduled = true;
    reconnectAttempt = 0;
    clearReconnectTimer();
    scheduleReconnectAttempt();
  };

  const adapter: DiscordAdapterWithRaw = {
    ...coreAdapter,
    async start() {
      stopping = false;
      await coreAdapter.start();
    },
    async stop() {
      stopping = true;
      reconnectScheduled = false;
      reconnectAttempt = 0;
      clearReconnectTimer();
      await coreAdapter.stop();
    },
    async registerSlashCommands(commands) {
      for (const command of commands) {
        slashCommands.set(command.name, command);
      }

      const payload = commands.map(toDiscordCommandPayload);
      await client.application?.commands?.set?.(payload);
    },
    onInteraction(handler) {
      interactionHandlers.add(handler);
    },
    [DISCORD_ADAPTER_RAW]: client,
  };

  const onReady = (): void => {
    if (client.user) {
      const selfUser = mapDiscordUser(client.user, adapter);
      runtime.setSelf(selfUser);
    }

    runtime.emit("ready", adapter.getSelf());
  };

  const onMessage = (message: DiscordMessageLike): void => {
    const mapped = mapDiscordMessage(message, adapter);
    runtime.cacheUser(mapped.sender);
    runtime.cacheConversation(mapped.conversation);
    runtime.emit("message", mapped);
  };

  const onMemberJoin = (member: { user: DiscordUserLike; guild?: DiscordChannelLike }): void => {
    const user = mapDiscordUser(member.user, adapter);
    const conversation = mapDiscordChannel(
      member.guild ?? {
        id: `guild:${member.user.id}`,
        name: "Guild",
      },
      adapter,
    );

    runtime.cacheUser(user);
    runtime.cacheConversation(conversation);
    runtime.emit("member-join", user, conversation);
  };

  const onMemberLeave = (member: { user: DiscordUserLike; guild?: DiscordChannelLike }): void => {
    const user = mapDiscordUser(member.user, adapter);
    const conversation = mapDiscordChannel(
      member.guild ?? {
        id: `guild:${member.user.id}`,
        name: "Guild",
      },
      adapter,
    );

    runtime.cacheUser(user);
    runtime.cacheConversation(conversation);
    runtime.emit("member-leave", user, conversation);
  };

  const onInteraction = async (interaction: DiscordInteraction): Promise<void> => {
    for (const handler of interactionHandlers) {
      await handler(interaction);
    }

    if (!isSlashCommandInteraction(interaction)) {
      return;
    }

    const command = interaction.commandName ? slashCommands.get(interaction.commandName) : undefined;
    if (!command) {
      return;
    }

    await command.handler(interaction, adapter);
  };

  client.on("ready", () => onReady());
  client.on("messageCreate", (...args) => onMessage(args[0] as DiscordMessageLike));
  client.on("guildMemberAdd", (...args) => onMemberJoin(args[0] as { user: DiscordUserLike; guild?: DiscordChannelLike }));
  client.on("guildMemberRemove", (...args) =>
    onMemberLeave(args[0] as { user: DiscordUserLike; guild?: DiscordChannelLike }),
  );
  client.on("interactionCreate", (...args) => {
    void onInteraction(args[0] as DiscordInteraction).catch((error) => runtime.emit("error", toError(error)));
  });
  client.on("error", (...args) => runtime.emit("error", toError(args[0])));
  client.on("disconnect", (...args) => handleDisconnect(args[0]));
  client.on("shardDisconnect", (...args) => handleDisconnect(args[0]));
  client.on("shardReconnecting", () => {
    runtime.emit("reconnecting", reconnectAttempt > 0 ? reconnectAttempt : 1);
  });
  client.on("shardResume", () => {
    reconnectScheduled = false;
    reconnectAttempt = 0;
    runtime.emit("reconnected");
  });

  return adapter;
}
