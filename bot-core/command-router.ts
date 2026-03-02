import type { BotContext, Middleware } from "./middleware";

export type CommandArgumentType = "string" | "number" | "boolean" | "user" | "channel";

export interface ArgumentDefinition {
  name: string;
  type: CommandArgumentType;
  required?: boolean;
  prompt?: string;
}

export type ParsedArgs = Record<string, string | number | boolean>;

export interface CommandDefinition {
  name: string;
  description: string;
  aliases?: string[];
  permissions?: string[];
  cooldownMs?: number;
  args?: ArgumentDefinition[];
  handler: (ctx: BotContext, args: string[], parsedArgs?: ParsedArgs) => Promise<void>;
}

export interface CommandRouterOptions {
  prefix?: string;
  caseSensitive?: boolean;
  hasPermission?: (ctx: BotContext, permission: string) => boolean | Promise<boolean>;
  onPermissionDenied?: (ctx: BotContext, command: CommandDefinition, missingPermission: string) => Promise<void>;
  onCooldown?: (ctx: BotContext, command: CommandDefinition, remainingMs: number) => Promise<void>;
}

interface CommandRouter {
  register(command: CommandDefinition): void;
  middleware: Middleware;
}

export function createCommandRouter(options: CommandRouterOptions = {}): CommandRouter {
  const prefix = options.prefix ?? "/";
  const caseSensitive = options.caseSensitive ?? false;

  const commandByKey = new Map<string, CommandDefinition>();
  const cooldownByUserAndCommand = new Map<string, number>();
  const cooldownCleanupTimers = new Map<string, ReturnType<typeof setTimeout>>();

  const normalize = (value: string): string => {
    return caseSensitive ? value : value.toLowerCase();
  };

  const register = (command: CommandDefinition): void => {
    const keys = [command.name, ...(command.aliases ?? [])].map(normalize);

    for (const key of keys) {
      const existing = commandByKey.get(key);
      if (existing && existing !== command) {
        throw new Error(`Command key already registered: ${key}`);
      }
    }

    for (const key of keys) {
      commandByKey.set(key, command);
    }
  };

  const scheduleCooldownCleanup = (cooldownKey: string, cooldownMs: number): void => {
    const activeTimer = cooldownCleanupTimers.get(cooldownKey);
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    const timer = setTimeout(() => {
      cooldownCleanupTimers.delete(cooldownKey);
      cooldownByUserAndCommand.delete(cooldownKey);
    }, cooldownMs);

    const nodeTimer = timer as { unref?: () => void };
    if (typeof nodeTimer.unref === "function") {
      nodeTimer.unref();
    }

    cooldownCleanupTimers.set(cooldownKey, timer);
  };

  const parseArgument = (
    rawValue: string,
    definition: ArgumentDefinition,
  ): string | number | boolean | undefined => {
    switch (definition.type) {
      case "string":
      case "user":
      case "channel":
        return rawValue;
      case "number": {
        const parsed = Number(rawValue);
        return Number.isFinite(parsed) ? parsed : undefined;
      }
      case "boolean": {
        const normalized = rawValue.toLowerCase();
        if (["1", "true", "yes", "on"].includes(normalized)) {
          return true;
        }
        if (["0", "false", "no", "off"].includes(normalized)) {
          return false;
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const parseCommandArgs = async (
    ctx: BotContext,
    command: CommandDefinition,
    args: string[],
  ): Promise<ParsedArgs | undefined> => {
    if (!command.args || command.args.length === 0) {
      return undefined;
    }

    const parsed: ParsedArgs = {};
    for (let index = 0; index < command.args.length; index += 1) {
      const definition = command.args[index];
      const raw = args[index];

      if (!raw || raw.trim().length === 0) {
        if (definition.required) {
          if (definition.prompt) {
            await ctx.message.reply(definition.prompt);
          }
          return undefined;
        }
        continue;
      }

      const parsedValue = parseArgument(raw, definition);
      if (parsedValue === undefined) {
        if (definition.prompt) {
          await ctx.message.reply(definition.prompt);
        }
        return undefined;
      }

      parsed[definition.name] = parsedValue;
    }

    return parsed;
  };

  const middleware: Middleware = async (ctx, next) => {
    if (ctx.message.kind !== "text") {
      await next();
      return;
    }

    const text = (ctx.message.content ?? "").trim();
    if (!text.startsWith(prefix)) {
      await next();
      return;
    }

    const withoutPrefix = text.slice(prefix.length).trim();
    if (withoutPrefix.length === 0) {
      await next();
      return;
    }

    const [name, ...args] = withoutPrefix.split(/\s+/);
    const command = commandByKey.get(normalize(name));

    if (!command) {
      await next();
      return;
    }

    if (options.hasPermission && command.permissions && command.permissions.length > 0) {
      for (const permission of command.permissions) {
        const granted = await options.hasPermission(ctx, permission);
        if (!granted) {
          await options.onPermissionDenied?.(ctx, command, permission);
          return;
        }
      }
    }

    if (command.cooldownMs && command.cooldownMs > 0) {
      const cooldownKey = `${ctx.message.sender.id}:${normalize(command.name)}`;
      const now = Date.now();
      const previous = cooldownByUserAndCommand.get(cooldownKey);
      if (typeof previous === "number") {
        const elapsed = now - previous;
        if (elapsed < command.cooldownMs) {
          await options.onCooldown?.(ctx, command, command.cooldownMs - elapsed);
          return;
        }
      }

      cooldownByUserAndCommand.set(cooldownKey, now);
      scheduleCooldownCleanup(cooldownKey, command.cooldownMs);
    }

    const parsedArgs = await parseCommandArgs(ctx, command, args);
    if (command.args && command.args.length > 0 && parsedArgs === undefined) {
      return;
    }

    await command.handler(ctx, args, parsedArgs);
  };

  return { register, middleware };
}
