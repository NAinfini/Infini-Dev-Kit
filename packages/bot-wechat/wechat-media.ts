import type { BotAdapter } from "@infini-dev-kit/bot-core/adapter-types";
import type { BotConversation } from "@infini-dev-kit/bot-core/conversation-types";
import type { BotMessage, BotMessagePayload, MessageKind } from "@infini-dev-kit/bot-core/message-types";

export interface WechatSayTarget {
  id: string;
  say?: (content: unknown) => Promise<unknown>;
}

interface WechatSendMetadata {
  conversation?: BotConversation;
  sender?: BotMessage["sender"];
  kind?: MessageKind;
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

  if (payload.text && payload.text.length > 0) {
    return payload.text;
  }

  if (payload.embed?.url) {
    return payload.embed.url;
  }

  if (payload.files && payload.files.length > 0) {
    return payload.files.map((file) => file.name).join(", ");
  }

  return "";
}

function toWechatSendEntries(payload: string | BotMessagePayload): unknown[] {
  if (typeof payload === "string") {
    return [payload];
  }

  const entries: unknown[] = [];

  if (payload.text) {
    entries.push(payload.text);
  }

  for (const file of payload.files ?? []) {
    entries.push({
      type: "file",
      name: file.name,
      data: file.data,
      mimeType: file.mimeType,
    });
  }

  if (payload.embed) {
    entries.push({
      type: "link",
      title: payload.embed.title,
      description: payload.embed.description,
      url: payload.embed.url,
    });
  }

  return entries.length > 0 ? entries : [""];
}

function createFallbackConversation(target: WechatSayTarget, adapter: BotAdapter): BotConversation {
  return {
    id: target.id,
    name: target.id,
    type: "direct",
    platform: "wechat",
    raw: target,
    async send(content) {
      return wechatSend(target, content, adapter, { conversation: this });
    },
    async getMembers() {
      return [];
    },
  };
}

export async function wechatSend(
  target: WechatSayTarget,
  payload: string | BotMessagePayload,
  adapter: BotAdapter,
  metadata: WechatSendMetadata = {},
): Promise<BotMessage> {
  const entries = toWechatSendEntries(payload);
  let lastRaw: unknown;

  for (const entry of entries) {
    if (target.say) {
      lastRaw = await target.say(entry);
    } else {
      lastRaw = entry;
    }
  }

  const conversation = metadata.conversation ?? createFallbackConversation(target, adapter);
  const sender = metadata.sender ?? adapter.getSelf();

  const message: BotMessage = {
    id: `wechat-out-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    content: inferContent(payload),
    kind: metadata.kind ?? inferKind(payload),
    sender,
    conversation,
    timestamp: new Date(),
    platform: "wechat",
    raw: lastRaw,
    async reply(content) {
      return wechatSend(target, content, adapter, {
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
