import { toError } from "@infini-dev-kit/utils/error";
import type { BotAdapter, BotEvent, BotEventHandler, BotEventMap } from "./adapter-types";
import type { BotConversation } from "./conversation-types";
import type { BotMessagePayload, BotPlatform } from "./message-types";
import type { BotUser } from "./user-types";

interface CacheStore<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): unknown;
}

export interface BaseAdapterRuntime {
  emit<E extends BotEvent>(event: E, ...args: Parameters<BotEventMap[E]>): void;
  cacheConversation(conversation: BotConversation): void;
  cacheUser(user: BotUser): void;
  setSelf(user: BotUser): void;
  setRunning(value: boolean): void;
  isRunning(): boolean;
}

export interface BaseAdapterConfig<TClient> {
  platform: BotPlatform;
  client: TClient;
  initialSelf: BotUser;
  startClient: (client: TClient) => Promise<void>;
  stopClient: (client: TClient) => Promise<void>;
  fetchConversation?: (client: TClient, id: string, adapter: BotAdapter) => Promise<BotConversation | undefined>;
  fetchUser?: (client: TClient, id: string, adapter: BotAdapter) => Promise<BotUser | undefined>;
  conversationCache: CacheStore<string, BotConversation>;
  userCache: CacheStore<string, BotUser>;
}

export interface BaseAdapterResult<TClient> {
  adapter: BotAdapter;
  client: TClient;
  runtime: BaseAdapterRuntime;
}

function createListeners(): { [K in BotEvent]: Set<BotEventHandler<K>> } {
  return {
    ready: new Set(),
    message: new Set(),
    error: new Set(),
    "member-join": new Set(),
    "member-leave": new Set(),
    disconnect: new Set(),
    reconnecting: new Set(),
    reconnected: new Set(),
  };
}

export function createBaseAdapter<TClient>(config: BaseAdapterConfig<TClient>): BaseAdapterResult<TClient> {
  const listeners = createListeners();
  let running = false;
  let selfUser = config.initialSelf;

  const emit = <E extends BotEvent>(event: E, ...args: Parameters<BotEventMap[E]>): void => {
    for (const handler of listeners[event]) {
      Promise.resolve((handler as (...xs: Parameters<BotEventMap[E]>) => unknown)(...args)).catch((error) => {
        if (event !== "error") {
          emit("error", toError(error));
        }
      });
    }
  };

  const adapter: BotAdapter = {
    platform: config.platform,
    async start() {
      if (running) {
        return;
      }

      await config.startClient(config.client);
      running = true;
    },
    async stop() {
      if (!running) {
        return;
      }

      await config.stopClient(config.client);
      running = false;
    },
    getSelf() {
      return selfUser;
    },
    isRunning() {
      return running;
    },
    on(event, handler) {
      (listeners[event] as Set<unknown>).add(handler as unknown);
    },
    off(event, handler) {
      (listeners[event] as Set<unknown>).delete(handler as unknown);
    },
    async sendMessage(conversationId: string, content: string | BotMessagePayload) {
      const conversation = await adapter.getConversation(conversationId);
      if (!conversation) {
        throw new Error(`Conversation not found: ${conversationId}`);
      }
      return conversation.send(content);
    },
    async getConversation(id: string) {
      const cached = config.conversationCache.get(id);
      if (cached) {
        return cached;
      }

      if (!config.fetchConversation) {
        return undefined;
      }

      const conversation = await config.fetchConversation(config.client, id, adapter);
      if (!conversation) {
        return undefined;
      }

      config.conversationCache.set(conversation.id, conversation);
      return conversation;
    },
    async getUser(id: string) {
      const cached = config.userCache.get(id);
      if (cached) {
        return cached;
      }

      if (!config.fetchUser) {
        return undefined;
      }

      const user = await config.fetchUser(config.client, id, adapter);
      if (!user) {
        return undefined;
      }

      config.userCache.set(user.id, user);
      return user;
    },
  };

  const runtime: BaseAdapterRuntime = {
    emit,
    cacheConversation(conversation) {
      config.conversationCache.set(conversation.id, conversation);
    },
    cacheUser(user) {
      config.userCache.set(user.id, user);
    },
    setSelf(user) {
      selfUser = user;
      config.userCache.set(user.id, user);
    },
    setRunning(value) {
      running = value;
    },
    isRunning() {
      return running;
    },
  };

  return {
    adapter,
    client: config.client,
    runtime,
  };
}
