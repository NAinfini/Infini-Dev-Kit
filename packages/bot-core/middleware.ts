import type { BotAdapter } from "./adapter-types";
import type { BotMessage } from "./message-types";

export interface BotContext {
  message: BotMessage;
  adapter: BotAdapter;
  state: Map<string, unknown>;
}

export type NextFn = () => Promise<void>;
export type Middleware = (ctx: BotContext, next: NextFn) => Promise<void>;

export function composeMiddleware(middlewares: Middleware[]): Middleware {
  return async (ctx, next) => {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }

      index = i;
      const fn = i < middlewares.length ? middlewares[i] : next;
      if (!fn) {
        return;
      }

      await fn(ctx, () => dispatch(i + 1));
    };

    await dispatch(0);
  };
}