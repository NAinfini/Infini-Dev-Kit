export interface ScrollReactiveOptions {
  property?: string;
  target?: HTMLElement;
}

export function createScrollReactiveVar(options: ScrollReactiveOptions = {}): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const property = options.property ?? "--scroll-y";
  const target = options.target ?? document.documentElement;

  const sync = () => {
    target.style.setProperty(property, window.scrollY.toFixed(2));
  };

  sync();
  window.addEventListener("scroll", sync, { passive: true });

  return () => {
    window.removeEventListener("scroll", sync);
    target.style.removeProperty(property);
  };
}
