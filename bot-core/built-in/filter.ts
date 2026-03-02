import type { BotMessage } from "../message-types";
import type { Middleware } from "../middleware";

export function filterMiddleware(predicate: (msg: BotMessage) => boolean): Middleware {
  return async (ctx, next) => {
    if (!predicate(ctx.message)) {
      return;
    }

    await next();
  };
}