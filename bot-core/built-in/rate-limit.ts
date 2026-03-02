import type { BotContext, Middleware } from "../middleware";

export interface RateLimitOptions {
  maxPerMinute: number;
  onLimit?: (ctx: BotContext) => Promise<void>;
}

export interface RateLimitMiddleware extends Middleware {
  dispose: () => void;
}

export function rateLimitMiddleware(options: RateLimitOptions): RateLimitMiddleware {
  const hitsByUser = new Map<string, number[]>();
  const cleanupTimers = new Map<string, ReturnType<typeof setTimeout>>();

  const clearUser = (userId: string): void => {
    const timer = cleanupTimers.get(userId);
    if (timer) {
      clearTimeout(timer);
      cleanupTimers.delete(userId);
    }
    hitsByUser.delete(userId);
  };

  const scheduleCleanup = (userId: string): void => {
    const activeTimer = cleanupTimers.get(userId);
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    const timer = setTimeout(() => {
      cleanupTimers.delete(userId);
      hitsByUser.delete(userId);
    }, 60_000);

    const nodeTimer = timer as { unref?: () => void };
    if (typeof nodeTimer.unref === "function") {
      nodeTimer.unref();
    }

    cleanupTimers.set(userId, timer);
  };

  const middleware: RateLimitMiddleware = async (ctx, next) => {
    const now = Date.now();
    const userId = ctx.message.sender.id;

    const recent = (hitsByUser.get(userId) ?? []).filter((t) => now - t < 60_000);
    if (recent.length > 0) {
      hitsByUser.set(userId, recent);
    } else {
      hitsByUser.delete(userId);
    }

    if (recent.length >= options.maxPerMinute) {
      scheduleCleanup(userId);
      if (options.onLimit) {
        await options.onLimit(ctx);
      }
      return;
    }

    recent.push(now);
    hitsByUser.set(userId, recent);
    scheduleCleanup(userId);
    await next();
  };

  middleware.dispose = () => {
    for (const userId of cleanupTimers.keys()) {
      clearUser(userId);
    }
    hitsByUser.clear();
  };

  return middleware;
}
