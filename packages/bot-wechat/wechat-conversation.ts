import type { BotAdapter } from "@infini-dev-kit/bot-core/adapter-types";
import type { BotConversation } from "@infini-dev-kit/bot-core/conversation-types";
import type { BotUser } from "@infini-dev-kit/bot-core/user-types";
import { wechatSend, type WechatSayTarget } from "./wechat-media";

export interface WechatContactLike extends WechatSayTarget {
  name?: () => string;
  alias?: () => string | undefined;
}

export interface WechatRoomLike extends WechatSayTarget {
  topic?: () => Promise<string>;
  memberAll?: () => Promise<WechatContactLike[]>;
}

export function mapDirectConversation(contact: WechatContactLike, adapter: BotAdapter): BotConversation {
  const conversation: BotConversation = {
    id: contact.id,
    name: contact.alias?.() ?? contact.name?.() ?? contact.id,
    type: "direct",
    platform: "wechat",
    raw: contact,
    async send(content) {
      return wechatSend(contact, content, adapter, { conversation });
    },
    async getMembers() {
      return [] as BotUser[];
    },
  };

  return conversation;
}

export function mapRoom(room: WechatRoomLike, adapter: BotAdapter): BotConversation {
  const conversation: BotConversation = {
    id: room.id,
    name: room.id,
    type: "group",
    platform: "wechat",
    raw: room,
    async send(content) {
      return wechatSend(room, content, adapter, { conversation });
    },
    async getMembers() {
      const members = await room.memberAll?.();
      if (!members) {
        return [];
      }

      return members.map((member): BotUser => ({
        id: member.id,
        name: member.name?.() ?? member.id,
        displayName: member.alias?.() ?? member.name?.() ?? member.id,
        platform: "wechat",
        raw: member,
        async send(content) {
          return wechatSend(member, content, adapter);
        },
      }));
    },
  };

  return conversation;
}
