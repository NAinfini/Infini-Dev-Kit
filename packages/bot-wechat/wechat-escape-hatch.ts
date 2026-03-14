import type { BotAdapter } from "../bot-core/adapter-types";
import type { BotConversation } from "../bot-core/conversation-types";
import type { BotMessage } from "../bot-core/message-types";
import type { BotUser } from "../bot-core/user-types";
import { WECHAT_ADAPTER_RAW, type WechatBotLike } from "./wechat-adapter";
import type { WechatMessageLike } from "./wechat-message";
import type { WechatContactLike, WechatRoomLike } from "./wechat-conversation";

interface WechatAdapterWithRaw extends BotAdapter {
  [WECHAT_ADAPTER_RAW]?: WechatBotLike;
}

function assertWechatPlatform(platform: string): void {
  if (platform !== "wechat") {
    throw new Error("Object is not a WeChat value");
  }
}

export function getWechatyInstance(adapter: BotAdapter): WechatBotLike {
  assertWechatPlatform(adapter.platform);
  const raw = (adapter as WechatAdapterWithRaw)[WECHAT_ADAPTER_RAW];
  if (!raw) {
    throw new Error("Adapter does not expose a Wechaty instance");
  }
  return raw;
}

export function getWechatyContact(user: BotUser): WechatContactLike {
  assertWechatPlatform(user.platform);
  return user.raw as WechatContactLike;
}

export function getWechatyRoom(conversation: BotConversation): WechatRoomLike {
  assertWechatPlatform(conversation.platform);
  return conversation.raw as WechatRoomLike;
}

export function getWechatyMessage(message: BotMessage): WechatMessageLike {
  assertWechatPlatform(message.platform);
  return message.raw as WechatMessageLike;
}