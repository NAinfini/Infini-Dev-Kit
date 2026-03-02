import type { BotConversation } from "./conversation-types";
import type { BotUser } from "./user-types";

export type BotPlatform = "wechat" | "discord";

export type MessageKind =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "file"
  | "link"
  | "location";

export interface BotFileAttachment {
  name: string;
  data: Buffer | ReadableStream | string;
  mimeType?: string;
}

export interface BotEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
}

export interface BotMessagePayload {
  text?: string;
  files?: BotFileAttachment[];
  embed?: BotEmbed;
}

export interface BotMessage {
  id: string;
  content: string;
  kind: MessageKind;
  sender: BotUser;
  conversation: BotConversation;
  timestamp: Date;
  platform: BotPlatform;
  raw: unknown;

  reply(content: string | BotMessagePayload): Promise<BotMessage>;
  forward(to: BotConversation): Promise<void>;
}