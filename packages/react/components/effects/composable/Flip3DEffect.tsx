import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";

type FlipContext = { flipped: boolean; toggle: () => void };
const FlipCtx = createContext<FlipContext | null>(null);

/** Hook to control a parent Flip3DEffect from a child component. */
export function useFlipCard(): FlipContext {
  const ctx = useContext(FlipCtx);
  if (!ctx) throw new Error("useFlipCard must be used inside a Flip3DEffect");
  return ctx;
}

/** Trigger component that toggles the nearest Flip3DEffect on click. */
export function FlipTarget({ children }: { children: ReactNode }) {
  const { toggle } = useFlipCard();
  return (
    <span role="button" tabIndex={0} onClick={toggle} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(); }} style={{ cursor: "pointer" }}>
      {children}
    </span>
  );
}

export type FlipDirection = "horizontal" | "vertical";

export interface Flip3DEffectProps {
  /** Front face content */
  front: ReactNode;
  /** Back face content */
  back: ReactNode;
  /** Controlled flipped state */
  flipped?: boolean;
  /** Callback when flip state changes */
  onFlipChange?: (flipped: boolean) => void;
  /** Flip direction (default: "horizontal") */
  direction?: FlipDirection;
  /** CSS perspective value (default: 1000) */
  perspective?: number;
  /** Flip animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Whether clicking toggles the flip (default: true) */
  clickToFlip?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 3D flip between front and back faces.
 * Extracted from FlipCard.
 */
export function Flip3DEffect({
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
}: Flip3DEffectProps) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();

  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = controlledFlipped !== undefined;
  const flipped = isControlled ? controlledFlipped : internalFlipped;

  const toggle = useCallback(() => {
    const next = !flipped;
    if (!isControlled) setInternalFlipped(next);
    onFlipChange?.(next);
  }, [flipped, isControlled, onFlipChange]);

  const rotateAxis = direction === "horizontal" ? "rotateY" : "rotateX";
  const flipAngle = flipped ? 180 : 0;

  const containerStyle: CSSProperties = { perspective, width: "100%", height: "100%", ...style };
  const faceBase: CSSProperties = { position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "var(--infini-radius)" };
  const ctx = useMemo<FlipContext>(() => ({ flipped, toggle }), [flipped, toggle]);

  const a11yProps = clickToFlip ? {
    onClick: toggle,
    role: "button" as const,
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") toggle(); },
  } : {};

  // OFF: static
  if (!motionAllowed) {
    return (
      <FlipCtx.Provider value={ctx}>
        <div className={className} style={containerStyle} {...a11yProps}>
          <div style={{ width: "100%", height: "100%" }}>{flipped ? back : front}</div>
        </div>
      </FlipCtx.Provider>
    );
  }

  // REDUCED: opacity crossfade
  if (!fullMotion) {
    return (
      <FlipCtx.Provider value={ctx}>
        <div className={className} style={{ ...containerStyle, perspective: undefined }} {...a11yProps}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "back" : "front"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration * 0.4 }}
                style={{ width: "100%", height: "100%" }}
              >
                {flipped ? back : front}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </FlipCtx.Provider>
    );
  }

  // FULL: 3D flip
  return (
    <FlipCtx.Provider value={ctx}>
      <div className={className} style={containerStyle} {...a11yProps}>
        <motion.div
          style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}
          animate={{ [rotateAxis]: flipAngle }}
          transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
        >
          <div style={{ ...faceBase, zIndex: 1 }}>{front}</div>
          <div style={{ ...faceBase, transform: `${rotateAxis}(180deg)`, zIndex: 0 }}>{back}</div>
        </motion.div>
      </div>
    </FlipCtx.Provider>
  );
}
