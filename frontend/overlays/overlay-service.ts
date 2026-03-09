export type ToastStatus = "success" | "error" | "warning" | "info";

export type ToastPayload = {
  title: string;
  status: ToastStatus;
  description?: string;
  duration?: number;
};

export type ToastResult = {
  delivered: boolean;
};

export type ConfirmPayload = {
  title: string;
  description?: string;
  intent?: "danger" | "warning" | "neutral";
  confirmLabel?: string;
  cancelLabel?: string;
};

export type PromptPayload = {
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export type DrawerPayload = {
  id: string;
  position?: "left" | "right" | "top" | "bottom";
  size?: string | number;
  title?: string;
};

export type OverlayHandlers = {
  toast?: (payload: ToastPayload) => void;
  confirm?: (payload: ConfirmPayload) => Promise<boolean>;
  prompt?: (payload: PromptPayload) => Promise<string | null>;
  drawer?: (payload: DrawerPayload) => Promise<void>;
};

export type OverlayService = {
  toast(payload: ToastPayload): ToastResult;
  confirm(payload: ConfirmPayload): Promise<boolean>;
  prompt(payload: PromptPayload): Promise<string | null>;
  drawer(payload: DrawerPayload): Promise<void>;
  register(handlers: Partial<OverlayHandlers>): () => void;
};

export function createOverlayService(): OverlayService {
  let current: Partial<OverlayHandlers> = {};

  return {
    toast(payload) {
      if (current.toast) {
        current.toast(payload);
        return { delivered: true };
      }
      return { delivered: false };
    },

    async confirm(payload) {
      if (current.confirm) {
        return current.confirm(payload);
      }
      return false;
    },

    async prompt(payload) {
      if (current.prompt) {
        return current.prompt(payload);
      }
      return null;
    },

    async drawer(payload) {
      if (current.drawer) {
        return current.drawer(payload);
      }
    },

    register(handlers) {
      current = { ...current, ...handlers };
      return () => {
        for (const key of Object.keys(handlers) as (keyof OverlayHandlers)[]) {
          if (current[key] === handlers[key]) {
            delete current[key];
          }
        }
      };
    },
  };
}
