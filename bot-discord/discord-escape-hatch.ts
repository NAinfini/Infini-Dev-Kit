import type { BotAdapter } from "../bot-core/adapter-types";
import type { BotConversation } from "../bot-core/conversation-types";
import type { BotMessage } from "../bot-core/message-types";
import type { BotUser } from "../bot-core/user-types";
import { DISCORD_ADAPTER_RAW, type DiscordClientLike } from "./discord-adapter";
import type { DiscordChannelLike } from "./discord-conversation";
import type { DiscordMessageLike } from "./discord-message";
import type { DiscordUserLike } from "./discord-user";

interface DiscordAdapterWithRaw extends BotAdapter {
  [DISCORD_ADAPTER_RAW]?: DiscordClientLike;
}

function assertDiscordPlatform(platform: string): void {
  if (platform !== "discord") {
    throw new Error("Object is not a Discord value");
  }
}

export function getDiscordClient(adapter: BotAdapter): DiscordClientLike {
  assertDiscordPlatform(adapter.platform);
  const raw = (adapter as DiscordAdapterWithRaw)[DISCORD_ADAPTER_RAW];
  if (!raw) {
    throw new Error("Adapter does not expose a Discord client");
  }
  return raw;
}

export function getDiscordUser(user: BotUser): DiscordUserLike {
  assertDiscordPlatform(user.platform);
  return user.raw as DiscordUserLike;
}

export function getDiscordChannel(conversation: BotConversation): DiscordChannelLike {
  assertDiscordPlatform(conversation.platform);
  return conversation.raw as DiscordChannelLike;
}

export function getDiscordMessage(message: BotMessage): DiscordMessageLike {
  assertDiscordPlatform(message.platform);
  return message.raw as DiscordMessageLike;
}