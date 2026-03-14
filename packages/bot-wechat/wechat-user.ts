import type { BotAdapter } from "@infini-dev-kit/bot-core/adapter-types";
import type { BotUser } from "@infini-dev-kit/bot-core/user-types";
import { mapDirectConversation, type WechatContactLike } from "./wechat-conversation";
import { wechatSend } from "./wechat-media";

export function mapContact(contact: WechatContactLike, adapter: BotAdapter): BotUser {
  return {
    id: contact.id,
    name: contact.name?.() ?? contact.id,
    displayName: contact.alias?.() ?? contact.name?.() ?? contact.id,
    platform: "wechat",
    raw: contact,
    async send(content) {
      const conversation = mapDirectConversation(contact, adapter);
      return wechatSend(contact, content, adapter, { conversation });
    },
  };
}
