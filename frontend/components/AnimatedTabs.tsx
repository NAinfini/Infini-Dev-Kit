import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AnimatedTabsProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Tabs with animated sliding underline indicator and content transitions.
 * Theme-aware colors and motion-gated animations.
 */
export function AnimatedTabs({
  items,
  activeKey: controlledKey,
  defaultActiveKey,
  onChange,
  indicatorColor,
  contentTransition = "fade",
  className,
}: AnimatedTabsProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [internalKey, setInternalKey] = useState(defaultActiveKey ?? items[0]?.key ?? "");

  const activeKey = controlledKey ?? internalKey;
  const color = indicatorColor ?? theme.palette.primary;
  const activeItem = items.find((item) => item.key === activeKey);

  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current.get(activeKey);
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeKey]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleSelect = (key: string) => {
    if (controlledKey === undefined) {
      setInternalKey(key);
    }
    onChange?.(key);
  };

  return (
    <div className={className}>
      {/* Tab bar */}
      <div
        style={{
          position: "relative",
          display: "flex",
          gap: 0,
          borderBottom: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            ref={(el) => {
              if (el) tabRefs.current.set(item.key, el);
            }}
            type="button"
            disabled={item.disabled}
            onClick={() => handleSelect(item.key)}
            style={{
              position: "relative",
              padding: "0.6rem 1.2rem",
              background: "none",
              border: "none",
              cursor: item.disabled ? "not-allowed" : "pointer",
              fontFamily: theme.typography.display,
              fontWeight: item.key === activeKey ? theme.typography.displayWeight : 400,
              fontSize: 14,
              color: item.key === activeKey ? color : theme.palette.textMuted,
              opacity: item.disabled ? 0.5 : 1,
              outline: "none",
              transition: motionAllowed ? "color 0.2s ease" : undefined,
            }}
          >
            {item.label}
          </button>
        ))}

        {/* Sliding underline indicator */}
        {motionAllowed ? (
          <motion.span
            aria-hidden
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={transition}
            style={{
              position: "absolute",
              bottom: -theme.foundation.borderWidth,
              height: 2,
              background: color,
              borderRadius: 1,
            }}
          />
        ) : (
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: -theme.foundation.borderWidth,
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: 2,
              background: color,
              borderRadius: 1,
            }}
          />
        )}
      </div>

      {/* Tab content */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {contentTransition === "none" || !motionAllowed ? (
          <div style={{ padding: "1rem 0" }}>{activeItem?.content}</div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeKey}
              initial={
                fullMotion && contentTransition === "slide"
                  ? { opacity: 0, x: 20 }
                  : { opacity: 0 }
              }
              animate={
                fullMotion && contentTransition === "slide"
                  ? { opacity: 1, x: 0 }
                  : { opacity: 1 }
              }
              exit={
                fullMotion && contentTransition === "slide"
                  ? { opacity: 0, x: -20 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.2 }}
              style={{ padding: "1rem 0" }}
            >
              {activeItem?.content}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
