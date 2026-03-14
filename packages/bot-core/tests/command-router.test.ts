import { describe, expect, it, vi } from "vitest";

import type { BotAdapter } from "../adapter-types";
import { createCommandRouter } from "../command-router";
import type { BotConversation } from "../conversation-types";
import type { BotMessage } from "../message-types";
import type { BotContext } from "../middleware";
import type { BotUser } from "../user-types";

function createMockAdapter(): BotAdapter {
  const self: BotUser = {
    id: "self",
    name: "Self",
    platform: "discord",
    raw: {},
    async send() {
      throw new Error("not implemented");
    },
  };

  return {
    platform: "discord",
    async start() {},
    async stop() {},
    getSelf() {
      return self;
    },
    isRunning() {
      return true;
    },
    on() {},
    off() {},
    async sendMessage() {
      throw new Error("not implemented");
    },
    async getConversation() {
      return undefined;
    },
    async getUser() {
      return undefined;
    },
  };
}

function createContext(content: string): BotContext {
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

  const message: BotMessage = {
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

  return {
    adapter: createMockAdapter(),
    message,
    state: new Map(),
  };
}

describe("createCommandRouter", () => {
  it("dispatches matched command", async () => {
    const handled = vi.fn(
      async (_ctx: BotContext, _args: string[]) => Promise.resolve(),
    );
    const router = createCommandRouter();

    router.register({
      name: "ping",
      description: "pong",
      handler: handled,
    });

    const ctx = createContext("/ping one two");

    await router.middleware(ctx, async () => Promise.resolve());

    expect(handled).toHaveBeenCalledTimes(1);
    expect(handled.mock.calls[0]?.[1]).toEqual(["one", "two"]);
  });

  it("falls through when command is unmatched", async () => {
    const router = createCommandRouter();
    const next = vi.fn(async () => Promise.resolve());

    await router.middleware(createContext("/unknown"), next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("supports aliases and case-insensitive matching by default", async () => {
    const handled = vi.fn(
      async (_ctx: BotContext, _args: string[]) => Promise.resolve(),
    );
    const router = createCommandRouter();

    router.register({
      name: "stats",
      aliases: ["report"],
      description: "stats",
      handler: handled,
    });

    await router.middleware(createContext("/REPORT"), async () => Promise.resolve());

    expect(handled).toHaveBeenCalledTimes(1);
  });

  it("parses typed command arguments when schema is provided", async () => {
    const handled = vi.fn(
      async (_ctx: BotContext, _args: string[], _parsed?: Record<string, string | number | boolean>) => Promise.resolve(),
    );
    const router = createCommandRouter();

    router.register({
      name: "setlimit",
      description: "set",
      args: [
        { name: "count", type: "number", required: true },
        { name: "enabled", type: "boolean", required: true },
      ],
      handler: handled,
    });

    await router.middleware(createContext("/setlimit 12 true"), async () => Promise.resolve());

    expect(handled).toHaveBeenCalledTimes(1);
    expect(handled.mock.calls[0]?.[2]).toEqual({
      count: 12,
      enabled: true,
    });
  });

  it("runs cooldown hook and blocks repeated command execution during cooldown", async () => {
    const handled = vi.fn(
      async (_ctx: BotContext, _args: string[]) => Promise.resolve(),
    );
    const onCooldown = vi.fn(async () => Promise.resolve());
    const router = createCommandRouter({ onCooldown });

    router.register({
      name: "ping",
      description: "ping",
      cooldownMs: 1_000,
      handler: handled,
    });

    const ctx = createContext("/ping");
    await router.middleware(ctx, async () => Promise.resolve());
    await router.middleware(ctx, async () => Promise.resolve());

    expect(handled).toHaveBeenCalledTimes(1);
    expect(onCooldown).toHaveBeenCalledTimes(1);
  });

  it("schedules cooldown cleanup timer to avoid stale cooldown entries", async () => {
    vi.useFakeTimers();
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const handled = vi.fn(
      async (_ctx: BotContext, _args: string[]) => Promise.resolve(),
    );
    const router = createCommandRouter();

    router.register({
      name: "ping",
      description: "ping",
      cooldownMs: 1_000,
      handler: handled,
    });

    await router.middleware(createContext("/ping"), async () => Promise.resolve());

    expect(handled).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
    vi.useRealTimers();
  });

  it("runs permission hook and blocks command when permission is missing", async () => {
    const handled = vi.fn(
      async (_ctx: BotContext, _args: string[]) => Promise.resolve(),
    );
    const onPermissionDenied = vi.fn(async () => Promise.resolve());
    const router = createCommandRouter({
      hasPermission: async () => false,
      onPermissionDenied,
    });

    router.register({
      name: "ban",
      description: "ban user",
      permissions: ["guild:ban"],
      handler: handled,
    });

    await router.middleware(createContext("/ban user123"), async () => Promise.resolve());

    expect(handled).not.toHaveBeenCalled();
    expect(onPermissionDenied).toHaveBeenCalledTimes(1);
  });

  it("replies with prompt and aborts when typed argument parsing fails", async () => {
    const handled = vi.fn(
      async (_ctx: BotContext, _args: string[]) => Promise.resolve(),
    );
    const router = createCommandRouter();

    router.register({
      name: "setlimit",
      description: "set",
      args: [{ name: "count", type: "number", required: true, prompt: "count must be numeric" }],
      handler: handled,
    });

    const ctx = createContext("/setlimit nope");
    const reply = vi.fn(async () => ctx.message);
    ctx.message.reply = reply;

    await router.middleware(ctx, async () => Promise.resolve());

    expect(handled).not.toHaveBeenCalled();
    expect(reply).toHaveBeenCalledWith("count must be numeric");
  });
});
