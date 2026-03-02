import { describe, expect, it, vi } from "vitest";

import type { BotAdapter } from "../../bot-core/adapter-types";
import { mapDiscordMessage } from "../discord-message";

function createMockAdapter(): BotAdapter {
  const self = {
    id: "self",
    name: "self",
    platform: "discord" as const,
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

describe("mapDiscordMessage", () => {
  it("maps message and replies via reply function", async () => {
    const reply = vi.fn(async () => Promise.resolve({ ok: true }));

    const msg = {
      id: "m1",
      content: "hello",
      author: {
        id: "u1",
        username: "alice",
      },
      channel: {
        id: "c1",
        name: "general",
        send: vi.fn(async () => Promise.resolve({})),
      },
      attachments: {
        size: 0,
        first: () => undefined,
      },
      reply,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
    };

    const mapped = mapDiscordMessage(msg, createMockAdapter());

    expect(mapped.id).toBe("m1");
    expect(mapped.kind).toBe("text");
    expect(mapped.sender.id).toBe("u1");

    await mapped.reply("pong");
    expect(reply).toHaveBeenCalledTimes(1);
  });
});