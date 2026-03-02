import type { BotContext, Middleware } from "../middleware";

export function errorBoundaryMiddleware(
  onError: (err: Error, ctx: BotContext) => Promise<void>,
): Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      await onError(normalized, ctx);
    }
  };
}