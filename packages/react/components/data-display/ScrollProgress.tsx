import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { forwardRef, useLayoutEffect, type CSSProperties, type RefObject } from "react";
import clsx from "clsx";

import { useFullMotion } from "../../hooks/use-motion-allowed";
import { useThemeSpring } from "../../hooks/use-theme-spring";

export interface ScrollProgressProps {
  className?: string;
  style?: CSSProperties;
  thicknessPx?: number;
  zIndex?: number;
  container?: RefObject<HTMLElement | null>;
}

type PositionStyleTarget = {
  style: {
    position: string;
    removeProperty: (property: string) => void;
  };
};

export function clampProgressScale(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

export function ensureNonStaticScrollContainerPosition<T extends PositionStyleTarget>(
  node: T | null,
  readPosition: (node: T) => string | null | undefined,
): (() => void) | undefined {
  if (!node) {
    return undefined;
  }

  const computedPosition = readPosition(node);
  if (computedPosition && computedPosition !== "static") {
    return undefined;
  }

  const previousInlinePosition = node.style.position;
  node.style.position = "relative";

  return () => {
    if (previousInlinePosition) {
      node.style.position = previousInlinePosition;
      return;
    }

    node.style.removeProperty("position");
  };
}

export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  function ScrollProgress({
    className,
    style,
    thicknessPx = 3,
    zIndex = 999,
    container,
    ...rest
  }, ref) {
    const fullMotion = useFullMotion();
    const springProfile = useThemeSpring();

    useLayoutEffect(() => {
      if (!container || typeof window === "undefined") {
        return undefined;
      }

      return ensureNonStaticScrollContainerPosition(
        container.current,
        (element) => window.getComputedStyle(element).position,
      );
    }, [container]);

    const { scrollYProgress } = useScroll(container ? { container } : undefined);
    const springScaleX = useSpring(scrollYProgress, springProfile);
    const scaleX = useTransform(springScaleX, clampProgressScale);

    if (!fullMotion) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        aria-hidden
        className={clsx(className)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: thicknessPx,
          background: "var(--infini-color-primary)",
          transformOrigin: "0% 50%",
          zIndex,
          scaleX,
          ...style,
        }}
        {...rest}
      />
    );
  }
);
