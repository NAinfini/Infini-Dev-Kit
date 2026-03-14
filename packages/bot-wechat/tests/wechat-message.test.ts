import { describe, expect, it, vi } from "vitest";

import type { BotAdapter } from "@infini-dev-kit/bot-core/adapter-types";
import { mapWechatMessage } from "../wechat-message";

function createMockAdapter(): BotAdapter {
  const self = {
    id: "self",
    name: "self",
    platform: "wechat" as const,
    raw: {},
    async send() {
      throw new Error("not implemented");
    },
  };

  return {
    platform: "wechat",
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

describe("mapWechatMessage", () => {
  it("maps basic text message", async () => {
    const say = vi.fn(async () => Promise.resolve({ ok: true }));

    const contact = {
      id: "contact-1",
      name: () => "alice",
      alias: () => "Alice",
      say,
    };

    const rawMessage = {
      id: "msg-1",
      text: () => "hello",
      type: () => 1,
      talker: () => contact,
      date: () => new Date("2024-01-01T00:00:00.000Z"),
    };

    const mapped = mapWechatMessage(rawMessage, createMockAdapter());

    expect(mapped.id).toBe("msg-1");
    expect(mapped.kind).toBe("text");
    expect(mapped.sender.id).toBe("contact-1");

    await mapped.reply("pong");
    expect(say).toHaveBeenCalledWith("pong");
  });
});
