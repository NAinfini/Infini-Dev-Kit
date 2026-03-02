import { describe, expect, it, vi } from "vitest";

import { createWechatAdapter, type WechatBotLike } from "../wechat-adapter";

function createMockWechatClient() {
  const handlers = new Map<string, Set<(...args: unknown[]) => void | Promise<void>>>();
  const findRoomSpy = vi.fn(async () => undefined as unknown);
  const findContactSpy = vi.fn(async () => undefined as unknown);

  const client: WechatBotLike & {
    emit(event: string, ...args: unknown[]): Promise<void>;
    startSpy: ReturnType<typeof vi.fn>;
    stopSpy: ReturnType<typeof vi.fn>;
    findRoomSpy: ReturnType<typeof vi.fn>;
    findContactSpy: ReturnType<typeof vi.fn>;
  } = {
    startSpy: vi.fn(async () => Promise.resolve()),
    stopSpy: vi.fn(async () => Promise.resolve()),
    findRoomSpy,
    findContactSpy,
    async start() {
      await client.startSpy();
    },
    async stop() {
      await client.stopSpy();
    },
    on(event, handler) {
      const bucket = handlers.get(event) ?? new Set();
      bucket.add(handler);
      handlers.set(event, bucket);
    },
    async findRoom(id) {
      return client.findRoomSpy(id);
    },
    async findContact(id) {
      return client.findContactSpy(id);
    },
    async emit(event, ...args) {
      for (const handler of handlers.get(event) ?? []) {
        await handler(...args);
      }
    },
  };

  return client;
}

describe("createWechatAdapter", () => {
  it("starts, receives login/message, and stops", async () => {
    const client = createMockWechatClient();
    const adapter = createWechatAdapter({ clientFactory: () => client });

    const onReady = vi.fn();
    const onMessage = vi.fn();

    adapter.on("ready", onReady);
    adapter.on("message", onMessage);

    await adapter.start();
    expect(adapter.isRunning()).toBe(true);

    const contact = {
      id: "contact-1",
      name: () => "alice",
      alias: () => "Alice",
      say: vi.fn(async () => Promise.resolve(undefined)),
    };

    await client.emit("login", contact);
    await client.emit("message", {
      id: "msg-1",
      text: () => "hello",
      type: () => 1,
      talker: () => contact,
      date: () => new Date(),
    });

    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(1);

    await adapter.stop();
    expect(adapter.isRunning()).toBe(false);
  });

  it("evicts old contact cache entries when cache size is bounded", async () => {
    const client = createMockWechatClient();
    client.findContactSpy = vi.fn(async (id: string) => ({
      id,
      name: () => `user-${id}`,
      alias: () => `alias-${id}`,
      say: vi.fn(async () => Promise.resolve(undefined)),
    }));

    const adapter = createWechatAdapter({
      cacheSize: { users: 1 },
      clientFactory: () => client,
    });

    await adapter.getUser("u1");
    await adapter.getUser("u2");
    await adapter.getUser("u1");

    expect(client.findContactSpy).toHaveBeenCalledTimes(3);
  });

  it("emits reconnect lifecycle events and retries on logout", async () => {
    vi.useFakeTimers();
    const client = createMockWechatClient();
    const adapter = createWechatAdapter({
      reconnect: {
        enabled: true,
        baseDelayMs: 5,
        maxDelayMs: 5,
        maxAttempts: 1,
      },
      clientFactory: () => client,
    });

    const onDisconnect = vi.fn();
    const onReconnecting = vi.fn();
    const onReconnected = vi.fn();

    adapter.on("disconnect", onDisconnect);
    adapter.on("reconnecting", onReconnecting);
    adapter.on("reconnected", onReconnected);

    await adapter.start();
    await client.emit("logout", "network");
    await vi.advanceTimersByTimeAsync(10);

    expect(onDisconnect).toHaveBeenCalledWith("network");
    expect(onReconnecting).toHaveBeenCalledWith(1);
    expect(onReconnected).toHaveBeenCalledTimes(1);
    expect(client.startSpy).toHaveBeenCalledTimes(2);

    await adapter.stop();
    vi.useRealTimers();
  });
});
