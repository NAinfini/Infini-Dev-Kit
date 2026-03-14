import { useEffect, useRef, useState } from "react";

export type UseInfiniParallaxOptions = {
  speed?: number;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
};

export function useInfiniParallax<T extends HTMLElement = HTMLDivElement>({
  speed = 0.3,
  direction = "vertical",
  disabled = false,
}: UseInfiniParallaxOptions = {}) {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (disabled || !ref.current) return;

    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const center = rect.top + rect.height / 2 - viewportHeight / 2;
      setOffset(center * speed * -1);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [speed, disabled]);

  const style: React.CSSProperties = disabled
    ? {}
    : {
        transform: direction === "vertical"
          ? `translateY(${offset}px)`
          : `translateX(${offset}px)`,
        willChange: "transform",
      };

  return { ref, style, offset };
}
