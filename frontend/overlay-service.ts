export type ToastStatus = "info" | "success" | "warning" | "error";

export interface ToastPayload {
  title: string;
  description?: string;
  status: ToastStatus;
}

export type ConfirmIntent = "neutral" | "danger" | "warning";

export interface ConfirmPayload {
  title: string;
  description?: string;
  intent: ConfirmIntent;
}

export interface OverlayHandlers {
  toast?: (payload: ToastPayload) => void;
  confirm?: (payload: ConfirmPayload) => Promise<boolean> | boolean;
}

export interface OverlayService {
  register(handlers: OverlayHandlers): () => void;
  toast(payload: ToastPayload): { delivered: boolean };
  confirm(payload: ConfirmPayload): Promise<boolean>;
}

export function createOverlayService(): OverlayService {
  let handlers: OverlayHandlers | undefined;

  return {
    register(nextHandlers) {
      handlers = nextHandlers;

      return () => {
        if (handlers === nextHandlers) {
          handlers = undefined;
        }
      };
    },
    toast(payload) {
      const toastHandler = handlers?.toast;
      if (!toastHandler) {
        return { delivered: false };
      }

      toastHandler(payload);
      return { delivered: true };
    },
    async confirm(payload) {
      const confirmHandler = handlers?.confirm;
      if (!confirmHandler) {
        return false;
      }

      const result = await confirmHandler(payload);
      return result;
    },
  };
}
