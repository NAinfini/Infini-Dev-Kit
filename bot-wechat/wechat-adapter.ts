import {
  createBaseAdapter,
  type AdapterReconnectOptions,
  type BotAdapter,
} from "../bot-core";
import type { BotConversation } from "../bot-core/conversation-types";
import type { BotUser } from "../bot-core/user-types";
import { LRUMap } from "../utils/lru-map";
import { toError } from "../utils/error";
import { mapDirectConversation, mapRoom, type WechatContactLike, type WechatRoomLike } from "./wechat-conversation";
import { mapWechatMessage, type WechatMessageLike } from "./wechat-message";
import { mapContact } from "./wechat-user";

export interface WechatBotLike {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  on: (event: string, handler: (...args: unknown[]) => void | Promise<void>) => void;
  off?: (event: string, handler: (...args: unknown[]) => void | Promise<void>) => void;
  findRoom?: (id: string) => Promise<WechatRoomLike | undefined>;
  findContact?: (id: string) => Promise<WechatContactLike | undefined>;
}

export interface WechatAdapterOptions {
  name?: string;
  puppet?: string;
  puppetOptions?: unknown;
  clientFactory?: () => WechatBotLike;
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

export const WECHAT_ADAPTER_RAW = Symbol("wechat-adapter-raw");

interface WechatAdapterWithRaw extends BotAdapter {
  [WECHAT_ADAPTER_RAW]?: WechatBotLike;
}

function createNoopWechatClient(): WechatBotLike {
  return {
    async start() {},
    async stop() {},
    on() {},
  };
}

function toDisconnectReason(reason: unknown): string {
  if (typeof reason === "string" && reason.trim()) {
    return reason;
  }

  if (reason && typeof reason === "object") {
    const withToString = reason as { toString?: () => string };
    if (typeof withToString.toString === "function") {
      const value = withToString.toString();
      if (value && value !== "[object Object]") {
        return value;
      }
    }
  }

  return "logout";
}

export function createWechatAdapter(options: WechatAdapterOptions = {}): BotAdapter {
  const client = options.clientFactory?.() ?? createNoopWechatClient();
  const conversationCacheSize = options.cacheSize?.conversations ?? DEFAULT_CONVERSATION_CACHE_SIZE;
  const userCacheSize = options.cacheSize?.users ?? DEFAULT_USER_CACHE_SIZE;
  const reconnect = {
    ...DEFAULT_RECONNECT,
    ...options.reconnect,
  };

  const conversationCache = new LRUMap<string, BotConversation>(conversationCacheSize);
  const userCache = new LRUMap<string, BotUser>(userCacheSize);

  const initialSelf: BotUser = {
    id: "wechat-self",
    name: options.name ?? "wechat-bot",
    platform: "wechat",
    raw: null,
    async send() {
      throw new Error("Cannot DM self user without a concrete contact");
    },
  };

  const { adapter: coreAdapter, runtime } = createBaseAdapter({
    platform: "wechat",
    client,
    initialSelf,
    startClient: async (activeClient) => {
      await activeClient.start();
    },
    stopClient: async (activeClient) => {
      await activeClient.stop();
    },
    conversationCache,
    userCache,
    fetchConversation: async (activeClient, id, adapter) => {
      const room = await activeClient.findRoom?.(id);
      if (room) {
        return mapRoom(room, adapter);
      }

      const contact = await activeClient.findContact?.(id);
      if (contact) {
        return mapDirectConversation(contact, adapter);
      }

      return undefined;
    },
    fetchUser: async (activeClient, id, adapter) => {
      const contact = await activeClient.findContact?.(id);
      if (!contact) {
        return undefined;
      }

      return mapContact(contact, adapter);
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
      runtime.emit("error", new Error("Wechat adapter reconnect attempts exhausted"));
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

  const adapter: WechatAdapterWithRaw = {
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
    [WECHAT_ADAPTER_RAW]: client,
  };

  const onLogin = (contact: WechatContactLike): void => {
    const self = mapContact(contact, adapter);
    runtime.setSelf(self);
    runtime.emit("ready", self);
  };

  const onMessage = (message: WechatMessageLike): void => {
    const mapped = mapWechatMessage(message, adapter);
    runtime.cacheUser(mapped.sender);
    runtime.cacheConversation(mapped.conversation);
    runtime.emit("message", mapped);
  };

  const onRoomJoin = (room: WechatRoomLike, invitees?: WechatContactLike[]): void => {
    const conversation = mapRoom(room, adapter);
    runtime.cacheConversation(conversation);

    for (const invitee of invitees ?? []) {
      const user = mapContact(invitee, adapter);
      runtime.cacheUser(user);
      runtime.emit("member-join", user, conversation);
    }
  };

  const onRoomLeave = (room: WechatRoomLike, leavers?: WechatContactLike[]): void => {
    const conversation = mapRoom(room, adapter);
    runtime.cacheConversation(conversation);

    for (const leaver of leavers ?? []) {
      const user = mapContact(leaver, adapter);
      runtime.cacheUser(user);
      runtime.emit("member-leave", user, conversation);
    }
  };

  client.on("login", (...args) => onLogin(args[0] as WechatContactLike));
  client.on("message", (...args) => onMessage(args[0] as WechatMessageLike));
  client.on("room-join", (...args) => onRoomJoin(args[0] as WechatRoomLike, args[1] as WechatContactLike[]));
  client.on("room-leave", (...args) => onRoomLeave(args[0] as WechatRoomLike, args[1] as WechatContactLike[]));
  client.on("error", (...args) => runtime.emit("error", toError(args[0])));
  client.on("logout", (...args) => handleDisconnect(args[0]));

  return adapter;
}
