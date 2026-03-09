import { motion } from "motion/react";
import { createContext, forwardRef, useCallback, useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import type { FlipCardProps } from "../../theme/motion-types";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeSnapshot } from "../../provider/InfiniProvider";

type FlipContext = {
  flipped: boolean;
  toggle: () => void;
};

const FlipCtx = createContext<FlipContext | null>(null);

/**
 * Hook to control a parent FlipCard from a child component.
 * Returns `{ flipped, toggle }`.
 */
export function useFlipCard(): FlipContext {
  const ctx = useContext(FlipCtx);
  if (!ctx) {
    throw new Error("useFlipCard must be used inside a FlipCard");
  }
  return ctx;
}

/**
 * A trigger component that toggles the nearest FlipCard on click.
 * Wraps its children in a span with onClick.
 */
export function FlipTarget({ children }: { children: ReactNode }) {
  const { toggle } = useFlipCard();
  return (
    <span role="button" tabIndex={0} onClick={toggle} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(); }} style={{ cursor: "pointer" }}>
      {children}
    </span>
  );
}

/**
 * Card that flips between front and back faces.
 * Theme-aware and motion-gated. Inspired by @gfazioli/mantine-flip
 * but built on the Infini Dev Kit pattern (motion/react, theme tokens).
 */
export const FlipCard = forwardRef<HTMLDivElement, FlipCardProps>(
  function FlipCard({
  front,
  back,
  flipped: controlledFlipped,
  onFlipChange,
  direction = "horizontal",
  perspective = 1000,
  duration = 0.6,
  clickToFlip = true,
  className,
  style,
  ...rest
}, ref) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();

  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = controlledFlipped !== undefined;
  const flipped = isControlled ? controlledFlipped : internalFlipped;

  const toggle = useCallback(() => {
    const next = !flipped;
    if (!isControlled) {
      setInternalFlipped(next);
    }
    onFlipChange?.(next);
  }, [flipped, isControlled, onFlipChange]);

  const rotateAxis = direction === "horizontal" ? "rotateY" : "rotateX";
  const flipAngle = flipped ? 180 : 0;

  const containerStyle: CSSProperties = {
    perspective,
    width: "100%",
    height: "100%",
    ...style,
  };

  const faceBase: CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    borderRadius: theme.foundation.radius,
  };

  const ctx = useMemo<FlipContext>(() => ({ flipped, toggle }), [flipped, toggle]);

  if (!motionAllowed) {
    return (
      <FlipCtx.Provider value={ctx}>
        <div
          ref={ref}
          className={className}
          {...rest}
          style={containerStyle}
          onClick={clickToFlip ? toggle : undefined}
          role={clickToFlip ? "button" : undefined}
          tabIndex={clickToFlip ? 0 : undefined}
          onKeyDown={clickToFlip ? (e) => { if (e.key === "Enter" || e.key === " ") toggle(); } : undefined}
        >
          <div style={{ width: "100%", height: "100%" }}>
            {flipped ? back : front}
          </div>
        </div>
      </FlipCtx.Provider>
    );
  }

  return (
    <FlipCtx.Provider value={ctx}>
      <div
        ref={ref}
        className={className}
        {...rest}
        style={containerStyle}
        onClick={clickToFlip ? toggle : undefined}
        role={clickToFlip ? "button" : undefined}
        tabIndex={clickToFlip ? 0 : undefined}
        onKeyDown={clickToFlip ? (e) => { if (e.key === "Enter" || e.key === " ") toggle(); } : undefined}
      >
        <motion.div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
          }}
          animate={{ [rotateAxis]: flipAngle }}
          transition={{
            duration,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Front face */}
          <div style={{ ...faceBase, zIndex: 1 }}>
            {front}
          </div>

          {/* Back face */}
          <div
            style={{
              ...faceBase,
              transform: `${rotateAxis}(180deg)`,
              zIndex: 0,
            }}
          >
            {back}
          </div>
        </motion.div>
      </div>
    </FlipCtx.Provider>
  );
  },
);
