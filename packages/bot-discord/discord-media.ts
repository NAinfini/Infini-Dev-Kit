import type { BotAdapter } from "../bot-core/adapter-types";
import type { BotConversation } from "../bot-core/conversation-types";
import type { BotMessage, BotMessagePayload, MessageKind } from "../bot-core/message-types";

export interface DiscordSendTarget {
  id: string;
  send?: (payload: unknown) => Promise<unknown>;
}

export interface DiscordRawMessage {
  id?: string;
  content?: string;
  channel?: DiscordSendTarget;
  reply?: (payload: unknown) => Promise<unknown>;
}

interface DiscordSendMetadata {
  conversation?: BotConversation;
  sender?: BotMessage["sender"];
  kind?: MessageKind;
}

function normalizePayload(payload: string | BotMessagePayload): unknown {
  if (typeof payload === "string") {
    return payload;
  }

  return {
    content: payload.text,
    files: payload.files,
    embeds: payload.embed ? [payload.embed] : undefined,
  };
}

function inferKind(payload: string | BotMessagePayload): MessageKind {
  if (typeof payload === "string") {
    return "text";
  }

  if (payload.files && payload.files.length > 0) {
    return "file";
  }

  if (payload.embed?.url) {
    return "link";
  }

  return "text";
}

function inferContent(payload: string | BotMessagePayload): string {
  if (typeof payload === "string") {
    return payload;
  }

  return payload.text ?? payload.embed?.url ?? "";
}

function createFallbackConversation(target: DiscordSendTarget, adapter: BotAdapter): BotConversation {
  return {
    id: target.id,
    name: target.id,
    type: "group",
    platform: "discord",
    raw: target,
    async send(content) {
      return discordSendChannel(target, content, adapter, { conversation: this });
    },
    async getMembers() {
      return [];
    },
  };
}

export async function discordSendChannel(
  target: DiscordSendTarget,
  payload: string | BotMessagePayload,
  adapter: BotAdapter,
  metadata: DiscordSendMetadata = {},
): Promise<BotMessage> {
  const rawPayload = normalizePayload(payload);
  const rawResult = target.send ? await target.send(rawPayload) : rawPayload;

  const conversation = metadata.conversation ?? createFallbackConversation(target, adapter);
  const sender = metadata.sender ?? adapter.getSelf();

  const message: BotMessage = {
    id: `discord-out-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    content: inferContent(payload),
    kind: metadata.kind ?? inferKind(payload),
    sender,
    conversation,
    timestamp: new Date(),
    platform: "discord",
    raw: rawResult,
    async reply(content) {
      return discordSendChannel(target, content, adapter, {
        conversation,
        sender,
      });
    },
    async forward(to) {
      await to.send(payload);
    },
  };

  return message;
}

export async function discordReply(
  message: DiscordRawMessage,
  payload: string | BotMessagePayload,
  adapter: BotAdapter,
  conversation: BotConversation,
): Promise<BotMessage> {
  const rawPayload = normalizePayload(payload);

  if (message.reply) {
    const rawResult = await message.reply(rawPayload);
    return {
      id: `discord-reply-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      content: inferContent(payload),
      kind: inferKind(payload),
      sender: adapter.getSelf(),
      conversation,
      timestamp: new Date(),
      platform: "discord",
      raw: rawResult,
      async reply(nextPayload) {
        return discordReply(message, nextPayload, adapter, conversation);
      },
      async forward(to) {
        await to.send(payload);
      },
    };
  }

  if (message.channel) {
    return discordSendChannel(message.channel, payload, adapter, { conversation });
  }

  throw new Error("Discord message has no reply or channel target");
}

export async function discordForward(
  message: DiscordRawMessage,
  to: BotConversation,
): Promise<void> {
  await to.send(message.content ?? "");
}