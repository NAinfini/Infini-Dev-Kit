import type { BotAdapter } from "@infini-dev-kit/bot-core/adapter-types";
import type { BotMessage, MessageKind } from "@infini-dev-kit/bot-core/message-types";
import { mapDirectConversation, mapRoom, type WechatContactLike, type WechatRoomLike } from "./wechat-conversation";
import { wechatSend } from "./wechat-media";
import { mapContact } from "./wechat-user";

export interface WechatMessageLike {
  id: string;
  text: () => string;
  type?: () => number | string;
  talker: () => WechatContactLike;
  room?: () => WechatRoomLike | undefined;
  date?: () => Date;
  forward?: (target: unknown) => Promise<unknown>;
}

const WECHAT_KIND_BY_CODE: Record<number, MessageKind> = {
  1: "text",
  3: "image",
  34: "audio",
  43: "video",
  6: "file",
  7: "link",
  48: "location",
};

function mapMessageType(typeValue: number | string | undefined): MessageKind {
  if (typeof typeValue === "number") {
    return WECHAT_KIND_BY_CODE[typeValue] ?? "text";
  }

  switch ((typeValue ?? "").toString().toLowerCase()) {
    case "image":
      return "image";
    case "audio":
      return "audio";
    case "video":
      return "video";
    case "attachment":
    case "file":
      return "file";
    case "url":
    case "link":
      return "link";
    case "location":
      return "location";
    default:
      return "text";
  }
}

export function mapWechatMessage(msg: WechatMessageLike, adapter: BotAdapter): BotMessage {
  const senderContact = msg.talker();
  const sender = mapContact(senderContact, adapter);
  const room = msg.room?.();

  const conversation = room ? mapRoom(room, adapter) : mapDirectConversation(senderContact, adapter);

  const content = msg.text();
  const kind = mapMessageType(msg.type?.());

  return {
    id: msg.id,
    content,
    kind,
    sender,
    conversation,
    timestamp: msg.date?.() ?? new Date(),
    platform: "wechat",
    raw: msg,
    async reply(replyContent) {
      const target = room ?? senderContact;
      return wechatSend(target, replyContent, adapter, {
        conversation,
      });
    },
    async forward(to) {
      if (msg.forward && to.raw) {
        await msg.forward(to.raw);
        return;
      }

      await to.send(content);
    },
  };
}
