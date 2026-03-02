import type { Middleware } from "../middleware";

export function loggerMiddleware(logger: (msg: string) => void = console.log): Middleware {
  return async (ctx, next) => {
    logger(
      `[${ctx.message.platform}] ${ctx.message.conversation.id} ${ctx.message.sender.id}: ${ctx.message.content}`,
    );
    await next();
  };
}