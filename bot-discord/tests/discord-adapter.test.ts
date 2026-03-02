import { describe, expect, it, vi } from "vitest";

import { createDiscordAdapter, type DiscordClientLike } from "../discord-adapter";

type DiscordHandler = (...args: unknown[]) => void | Promise<void>;

function createMockDiscordClient() {
  const handlers = new Map<string, Set<DiscordHandler>>();
  const fetchChannelSpy = vi.fn(async () => undefined as unknown);
  const fetchUserSpy = vi.fn(async () => undefined as unknown);

  const client: DiscordClientLike & {
    emit(event: string, ...args: unknown[]): Promise<void>;
    loginSpy: ReturnType<typeof vi.fn>;
    destroySpy: ReturnType<typeof vi.fn>;
    commandsSetSpy: ReturnType<typeof vi.fn>;
    fetchChannelSpy: ReturnType<typeof vi.fn>;
    fetchUserSpy: ReturnType<typeof vi.fn>;
  } = {
    loginSpy: vi.fn(async () => Promise.resolve("ok")),
    destroySpy: vi.fn(async () => Promise.resolve(undefined)),
    commandsSetSpy: vi.fn(async () => Promise.resolve(undefined)),
    fetchChannelSpy,
    fetchUserSpy,
    user: {
      id: "self",
      username: "bot",
    },
    application: {
      commands: {
        set: async (commands) => client.commandsSetSpy(commands),
      },
    },
    channels: {
      fetch: async (id) => client.fetchChannelSpy(id),
    },
    users: {
      fetch: async (id) => client.fetchUserSpy(id),
    },
    async login(token) {
      await client.loginSpy(token);
      return "ok";
    },
    async destroy() {
      await client.destroySpy();
    },
    on(event, handler) {
      const bucket = handlers.get(event) ?? new Set();
      bucket.add(handler);
      handlers.set(event, bucket);
    },
    async emit(event, ...args) {
      for (const handler of handlers.get(event) ?? []) {
        await handler(...args);
      }
    },
  };

  return client;
}

describe("createDiscordAdapter", () => {
  it("starts, emits ready/message, registers slash commands, and stops", async () => {
    const client = createMockDiscordClient();
    const adapter = createDiscordAdapter({
      token: "test-token",
      clientFactory: () => client,
    });

    const onReady = vi.fn();
    const onMessage = vi.fn();

    adapter.on("ready", onReady);
    adapter.on("message", onMessage);

    await adapter.start();
    expect(adapter.isRunning()).toBe(true);

    await client.emit("ready");
    await client.emit("messageCreate", {
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
      reply: vi.fn(async () => Promise.resolve({})),
      createdAt: new Date(),
    });

    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(1);

    if ("registerSlashCommands" in adapter && typeof adapter.registerSlashCommands === "function") {
      await adapter.registerSlashCommands([
        {
          name: "ping",
          description: "pong",
          handler: async () => Promise.resolve(),
        },
      ]);
    }

    expect(client.commandsSetSpy).toHaveBeenCalledTimes(1);

    await adapter.stop();
    expect(adapter.isRunning()).toBe(false);
  });

  it("evicts old user cache entries when cache size is bounded", async () => {
    const client = createMockDiscordClient();
    client.fetchUserSpy = vi.fn(async (id: string) => ({
      id,
      username: `user-${id}`,
      send: vi.fn(async () => Promise.resolve({})),
    }));

    const adapter = createDiscordAdapter({
      token: "test-token",
      cacheSize: { users: 1 },
      clientFactory: () => client,
    });

    await adapter.getUser("u1");
    await adapter.getUser("u2");
    await adapter.getUser("u1");

    expect(client.fetchUserSpy).toHaveBeenCalledTimes(3);
  });

  it("emits reconnect lifecycle events and retries on disconnect", async () => {
    vi.useFakeTimers();
    const client = createMockDiscordClient();
    const adapter = createDiscordAdapter({
      token: "test-token",
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
    await client.emit("disconnect", "network");
    await vi.advanceTimersByTimeAsync(10);

    expect(onDisconnect).toHaveBeenCalledWith("network");
    expect(onReconnecting).toHaveBeenCalledWith(1);
    expect(onReconnected).toHaveBeenCalledTimes(1);
    expect(client.loginSpy).toHaveBeenCalledTimes(2);

    await adapter.stop();
    vi.useRealTimers();
  });
});
