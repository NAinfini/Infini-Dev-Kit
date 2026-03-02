import { describe, expect, it, vi } from "vitest";

import type { BotAdapter, BotEvent, BotEventHandler } from "../adapter-types";
import { createBot } from "../bot";
import type { BotConversation } from "../conversation-types";
import type { BotMessage } from "../message-types";
import type { BotUser } from "../user-types";

interface MockAdapter extends BotAdapter {
  emitMessage(message: BotMessage): Promise<void>;
  startCalls: number;
  stopCalls: number;
}

function createMockMessage(content: string): BotMessage {
  const user: BotUser = {
    id: "u1",
    name: "User",
    platform: "discord",
    raw: {},
    async send() {
      throw new Error("not implemented");
    },
  };

  const conversation: BotConversation = {
    id: "c1",
    name: "Room",
    type: "group",
    platform: "discord",
    raw: {},
    async send() {
      throw new Error("not implemented");
    },
    async getMembers() {
      return [user];
    },
  };

  return {
    id: "m1",
    content,
    kind: "text",
    sender: user,
    conversation,
    timestamp: new Date(),
    platform: "discord",
    raw: {},
    async reply() {
      return this;
    },
    async forward() {},
  };
}

function createMockAdapter(): MockAdapter {
  const handlers: {
    [K in BotEvent]: Set<BotEventHandler<K>>;
  } = {
    ready: new Set(),
    message: new Set(),
    error: new Set(),
    "member-join": new Set(),
    "member-leave": new Set(),
    disconnect: new Set(),
    reconnecting: new Set(),
    reconnected: new Set(),
  };

  const self: BotUser = {
    id: "self",
    name: "Self",
    platform: "discord",
    raw: {},
    async send() {
      throw new Error("not implemented");
    },
  };

  let running = false;

  const adapter: MockAdapter = {
    platform: "discord",
    startCalls: 0,
    stopCalls: 0,
    async start() {
      adapter.startCalls += 1;
      running = true;
    },
    async stop() {
      adapter.stopCalls += 1;
      running = false;
    },
    getSelf() {
      return self;
    },
    isRunning() {
      return running;
    },
    on(event, handler) {
      (handlers[event] as Set<unknown>).add(handler as unknown);
    },
    off(event, handler) {
      (handlers[event] as Set<unknown>).delete(handler as unknown);
    },
    async sendMessage() {
      throw new Error("not implemented");
    },
    async getConversation() {
      return undefined;
    },
    async getUser() {
      return undefined;
    },
    async emitMessage(message) {
      const messageHandlers = Array.from(handlers.message);
      for (const handler of messageHandlers) {
        await handler(message);
      }
    },
  };

  return adapter;
}

describe("createBot", () => {
  it("starts, routes commands, and stops", async () => {
    const adapter = createMockAdapter();
    const cmd = vi.fn(
      async (_ctx: import("../middleware").BotContext, _args: string[]) => Promise.resolve(),
    );

    const bot = createBot({
      adapter,
      commands: [
        {
          name: "ping",
          description: "ping",
          handler: cmd,
        },
      ],
    });

    await bot.start();
    await adapter.emitMessage(createMockMessage("/ping"));
    await bot.stop();

    expect(adapter.startCalls).toBe(1);
    expect(adapter.stopCalls).toBe(1);
    expect(cmd).toHaveBeenCalledTimes(1);
  });

  it("applies added middleware", async () => {
    const adapter = createMockAdapter();
    const seen = vi.fn((value: string) => value);

    const bot = createBot({ adapter });
    bot.use(async (ctx, next) => {
      seen(ctx.message.content);
      await next();
    });

    await bot.start();
    await adapter.emitMessage(createMockMessage("hello"));

    expect(seen).toHaveBeenCalledWith("hello");

    await bot.stop();
  });

  it("reuses composed middleware between messages until middleware list changes", async () => {
    vi.resetModules();
    const middlewareModule = await import("../middleware");
    const composeSpy = vi.spyOn(middlewareModule, "composeMiddleware");
    const botModule = await import("../bot");

    const adapter = createMockAdapter();
    const bot = botModule.createBot({ adapter });

    await bot.start();
    await adapter.emitMessage(createMockMessage("first"));
    await adapter.emitMessage(createMockMessage("second"));

    expect(composeSpy).toHaveBeenCalledTimes(1);

    bot.use(async (_ctx, next) => {
      await next();
    });

    await adapter.emitMessage(createMockMessage("third"));

    expect(composeSpy).toHaveBeenCalledTimes(2);

    await bot.stop();
    composeSpy.mockRestore();
  });

  it("supports function plugins and runs plugin cleanup on stop", async () => {
    const adapter = createMockAdapter();
    const pluginCleanup = vi.fn();
    const plugin = vi.fn((_bot: import("../bot").UnifiedBot) => pluginCleanup);
    const seen = vi.fn((value: string) => value);

    const bot = createBot({ adapter });
    bot.use(plugin);
    bot.use(async (ctx, next) => {
      seen(ctx.message.content);
      await next();
    });

    await bot.start();
    await adapter.emitMessage(createMockMessage("from-plugin"));
    await bot.stop();

    expect(plugin).toHaveBeenCalledTimes(1);
    expect(seen).toHaveBeenCalledWith("from-plugin");
    expect(pluginCleanup).toHaveBeenCalledTimes(1);
  });
});
