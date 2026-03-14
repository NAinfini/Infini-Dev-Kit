import type { BotConversation } from "./conversation-types";
import type { BotMessage, BotMessagePayload, BotPlatform } from "./message-types";
import type { BotUser } from "./user-types";

export interface BotEventMap {
  ready: (self: BotUser) => void | Promise<void>;
  message: (msg: BotMessage) => void | Promise<void>;
  error: (err: Error) => void | Promise<void>;
  "member-join": (user: BotUser, conversation: BotConversation) => void | Promise<void>;
  "member-leave": (user: BotUser, conversation: BotConversation) => void | Promise<void>;
  disconnect: (reason: string) => void | Promise<void>;
  reconnecting: (attempt: number) => void | Promise<void>;
  reconnected: () => void | Promise<void>;
}

export type BotEvent = keyof BotEventMap;

export type BotEventHandler<E extends BotEvent> = BotEventMap[E];

export interface BotAdapter {
  readonly platform: BotPlatform;

  start(): Promise<void>;
  stop(): Promise<void>;
  getSelf(): BotUser;
  isRunning(): boolean;

  on<E extends BotEvent>(event: E, handler: BotEventHandler<E>): void;
  off<E extends BotEvent>(event: E, handler: BotEventHandler<E>): void;

  sendMessage(conversationId: string, content: string | BotMessagePayload): Promise<BotMessage>;
  getConversation(id: string): Promise<BotConversation | undefined>;
  getUser(id: string): Promise<BotUser | undefined>;
}

export interface AdapterReconnectOptions {
  enabled?: boolean;
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}
