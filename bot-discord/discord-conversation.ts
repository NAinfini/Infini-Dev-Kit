import type { BotAdapter } from "../bot-core/adapter-types";
import type { BotConversation } from "../bot-core/conversation-types";
import type { BotUser } from "../bot-core/user-types";
import { discordSendChannel, type DiscordSendTarget } from "./discord-media";
import { mapDiscordUser, type DiscordUserLike } from "./discord-user";

export interface DiscordChannelLike extends DiscordSendTarget {
  name?: string;
  isDMBased?: () => boolean;
  members?: { values: () => Iterable<DiscordUserLike> };
}

export function mapDiscordChannel(channel: DiscordChannelLike, adapter: BotAdapter): BotConversation {
  const conversation: BotConversation = {
    id: channel.id,
    name: channel.name ?? "DM",
    type: channel.isDMBased?.() ? "direct" : "group",
    platform: "discord",
    raw: channel,
    async send(content) {
      return discordSendChannel(channel, content, adapter, { conversation });
    },
    async getMembers() {
      const members = channel.members ? Array.from(channel.members.values()) : [];
      return members.map((member): BotUser => mapDiscordUser(member, adapter));
    },
  };

  return conversation;
}