import type { BotAdapter } from "@infini-dev-kit/bot-core/adapter-types";
import type { BotUser } from "@infini-dev-kit/bot-core/user-types";
import { mapDiscordChannel, type DiscordChannelLike } from "./discord-conversation";
import { discordSendChannel, type DiscordSendTarget } from "./discord-media";

export interface DiscordUserLike extends DiscordSendTarget {
  username: string;
  displayName?: string;
  avatarURL?: () => string | null;
  createDM?: () => Promise<DiscordChannelLike>;
}

export function mapDiscordUser(user: DiscordUserLike, adapter: BotAdapter): BotUser {
  return {
    id: user.id,
    name: user.username,
    displayName: user.displayName ?? user.username,
    avatarUrl: user.avatarURL?.() ?? undefined,
    platform: "discord",
    raw: user,
    async send(content) {
      if (user.createDM) {
        const channel = await user.createDM();
        const conversation = mapDiscordChannel(channel, adapter);
        return discordSendChannel(channel, content, adapter, { conversation });
      }

      return discordSendChannel(user, content, adapter);
    },
  };
}
