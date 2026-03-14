import type { BotAdapter } from "@infini-dev-kit/bot-core/adapter-types";
import type { BotMessage, MessageKind } from "@infini-dev-kit/bot-core/message-types";
import { mapDiscordChannel, type DiscordChannelLike } from "./discord-conversation";
import { discordForward, discordReply, type DiscordRawMessage } from "./discord-media";
import { mapDiscordUser, type DiscordUserLike } from "./discord-user";

export interface DiscordAttachmentLike {
  contentType?: string;
  name?: string;
}

export interface DiscordMessageLike extends DiscordRawMessage {
  id: string;
  content: string;
  author: DiscordUserLike;
  channel: DiscordChannelLike;
  createdAt?: Date;
  attachments?: {
    size: number;
    first: () => DiscordAttachmentLike | undefined;
  };
}

function mapAttachmentType(attachment: DiscordAttachmentLike | undefined): MessageKind {
  if (!attachment) {
    return "text";
  }

  const type = attachment.contentType ?? "";
  if (type.startsWith("image/")) {
    return "image";
  }
  if (type.startsWith("audio/")) {
    return "audio";
  }
  if (type.startsWith("video/")) {
    return "video";
  }

  if (attachment.name && /\.(png|jpg|jpeg|gif|webp)$/i.test(attachment.name)) {
    return "image";
  }

  return "file";
}

export function mapDiscordMessage(msg: DiscordMessageLike, adapter: BotAdapter): BotMessage {
  const sender = mapDiscordUser(msg.author, adapter);
  const conversation = mapDiscordChannel(msg.channel, adapter);
  const firstAttachment = msg.attachments?.first?.();

  return {
    id: msg.id,
    content: msg.content,
    kind: msg.attachments && msg.attachments.size > 0 ? mapAttachmentType(firstAttachment) : "text",
    sender,
    conversation,
    timestamp: msg.createdAt ?? new Date(),
    platform: "discord",
    raw: msg,
    async reply(content) {
      return discordReply(msg, content, adapter, conversation);
    },
    async forward(to) {
      await discordForward(msg, to);
    },
  };
}
