import { describe, expect, it, vi } from "vitest";

import type { BotAdapter } from "../adapter-types";
import { rateLimitMiddleware } from "../built-in/rate-limit";
import type { BotConversation } from "../conversation-types";
import type { BotMessage } from "../message-types";
import type { BotUser } from "../user-types";
import { composeMiddleware, type BotContext } from "../middleware";

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

describe("composeMiddleware", () => {
  it("runs middleware in order and executes next chain", async () => {
    const calls: string[] = [];
    const ctx: BotContext = {
      adapter: createMockAdapter(),
      message: createMockMessage("hello"),
      state: new Map(),
    };

    const pipeline = composeMiddleware([
      async (_ctx, next) => {
        calls.push("a:before");
        await next();
        calls.push("a:after");
      },
      async (_ctx, next) => {
        calls.push("b:before");
        await next();
        calls.push("b:after");
      },
    ]);

    await pipeline(ctx, async () => {
      calls.push("terminal");
    });

    expect(calls).toEqual(["a:before", "b:before", "terminal", "b:after", "a:after"]);
  });

  it("throws if next() is called multiple times", async () => {
    const ctx: BotContext = {
      adapter: createMockAdapter(),
      message: createMockMessage("hello"),
      state: new Map(),
    };

    const pipeline = composeMiddleware([
      async (_ctx, next) => {
        await next();
        await next();
      },
    ]);

    await expect(
      pipeline(ctx, async () => Promise.resolve()),
    ).rejects.toThrow("next() called multiple times");
  });
});

describe("rateLimitMiddleware", () => {
  it("can dispose internal state so throttled users are reset immediately", async () => {
    const onLimit = vi.fn(async () => Promise.resolve());
    const next = vi.fn(async () => Promise.resolve());
    const limiter = rateLimitMiddleware({
      maxPerMinute: 1,
      onLimit,
    });

    const ctx: BotContext = {
      adapter: createMockAdapter(),
      message: createMockMessage("hello"),
      state: new Map(),
    };

    await limiter(ctx, next);
    await limiter(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(onLimit).toHaveBeenCalledTimes(1);

    (limiter as { dispose: () => void }).dispose();

    await limiter(ctx, next);

    expect(next).toHaveBeenCalledTimes(2);
  });
});
