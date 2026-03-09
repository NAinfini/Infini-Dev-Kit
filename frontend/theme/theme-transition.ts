export type ThemeTransitionOptions = {
  duration?: number;
  easing?: string;
  properties?: string[];
};

const DEFAULT_PROPERTIES = [
  "background-color",
  "color",
  "border-color",
  "box-shadow",
  "fill",
  "stroke",
];

export function applyThemeTransition(
  element: HTMLElement,
  options: ThemeTransitionOptions = {},
): () => void {
  const {
    duration = 300,
    easing = "ease-in-out",
    properties = DEFAULT_PROPERTIES,
  } = options;

  const transition = properties
    .map((prop) => `${prop} ${duration}ms ${easing}`)
    .join(", ");

  element.style.transition = transition;

  const cleanup = () => {
    element.style.transition = "";
  };

  const timer = window.setTimeout(cleanup, duration + 50);

  return () => {
    window.clearTimeout(timer);
    cleanup();
  };
}

export function createThemeTransitionManager(rootSelector = ":root") {
  let cleanupFn: (() => void) | null = null;

  return {
    beforeSwitch(options?: ThemeTransitionOptions) {
      const root = document.querySelector<HTMLElement>(rootSelector);
      if (!root) return;
      cleanupFn?.();
      cleanupFn = applyThemeTransition(root, options);
    },

    afterSwitch() {
      // Transition is auto-cleaned by timer, but can force cleanup
      cleanupFn?.();
      cleanupFn = null;
    },
  };
}
