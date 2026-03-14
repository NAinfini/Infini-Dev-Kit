import type { BotMessage, BotMessagePayload, BotPlatform } from "./message-types";

export interface BotUser {
  id: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
  platform: BotPlatform;
  raw: unknown;

  send(content: string | BotMessagePayload): Promise<BotMessage>;
}