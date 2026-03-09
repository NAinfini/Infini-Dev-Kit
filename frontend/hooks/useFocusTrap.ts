import { useEffect, useRef } from "react";

export type UseFocusTrapOptions = {
  active?: boolean;
  initialFocus?: string;
  returnFocusOnDeactivate?: boolean;
};

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({
  active = true,
  initialFocus,
  returnFocusOnDeactivate = true,
}: UseFocusTrapOptions = {}) {
  const ref = useRef<T | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    previousFocus.current = document.activeElement as HTMLElement | null;

    const container = ref.current;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    if (initialFocus) {
      const target = container.querySelector<HTMLElement>(initialFocus);
      target?.focus();
    } else {
      const first = container.querySelector<HTMLElement>(focusableSelector);
      first?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) { e.preventDefault(); return; }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      if (returnFocusOnDeactivate && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [active, initialFocus, returnFocusOnDeactivate]);

  return ref;
}
