import type { BotMessage, BotMessagePayload, BotPlatform } from "./message-types";
import type { BotUser } from "./user-types";

export type ConversationType = "direct" | "group";

export interface BotConversation {
  id: string;
  name: string;
  type: ConversationType;
  platform: BotPlatform;
  raw: unknown;

  send(content: string | BotMessagePayload): Promise<BotMessage>;
  getMembers(): Promise<BotUser[]>;
}