import { forwardRef, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

import type { AnimatedTabsProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

/**
 * Tabs with animated sliding underline indicator and content transitions.
 * Theme-aware colors and motion-gated animations.
 */
export const AnimatedTabs = forwardRef<HTMLDivElement, AnimatedTabsProps>(
  function AnimatedTabs({
    items,
    activeKey: controlledKey,
    defaultActiveKey,
    onChange,
    indicatorColor,
    contentTransition = "fade",
    className,
    style,
    ...rest
  }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const transition = useThemeTransition("hover");
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [internalKey, setInternalKey] = useState(defaultActiveKey ?? items[0]?.key ?? "");

    const activeKey = controlledKey ?? internalKey;
    const color = indicatorColor ?? "var(--infini-color-primary)";
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

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const enabledItems = items.filter((item) => !item.disabled);
      const currentIndex = enabledItems.findIndex((item) => item.key === activeKey);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % enabledItems.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = enabledItems.length - 1;
      }

      if (nextIndex >= 0) {
        const nextKey = enabledItems[nextIndex].key;
        handleSelect(nextKey);
        tabRefs.current.get(nextKey)?.focus();
      }
    };

    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        {/* Tab bar */}
        <div
          role="tablist"
          onKeyDown={handleKeyDown}
          style={{
            position: "relative",
            display: "flex",
            gap: 0,
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            borderBottom: "var(--infini-border-width) var(--infini-border-style, solid) var(--infini-color-border)",
          }}
        >
          {items.map((item) => (
            <button
              key={item.key}
              ref={(el) => {
                if (el) tabRefs.current.set(item.key, el);
              }}
              type="button"
              role="tab"
              aria-selected={item.key === activeKey}
              aria-controls={`tabpanel-${item.key}`}
              id={`tab-${item.key}`}
              tabIndex={item.key === activeKey ? 0 : -1}
              disabled={item.disabled}
              onClick={() => handleSelect(item.key)}
              style={{
                position: "relative",
                padding: "0.6rem 1.2rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: "none",
                border: "none",
                cursor: item.disabled ? "not-allowed" : "pointer",
                fontFamily: "var(--infini-font-display)",
                fontWeight: item.key === activeKey ? "var(--infini-font-display-weight, 700)" as CSSProperties["fontWeight"] : 400,
                fontSize: 14,
                color: item.key === activeKey ? color : "var(--infini-color-text-muted)",
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
                bottom: "calc(-1 * var(--infini-border-width, 1px))",
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
                bottom: "calc(-1 * var(--infini-border-width, 1px))",
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
        <div role="tabpanel" id={`tabpanel-${activeKey}`} aria-labelledby={`tab-${activeKey}`} style={{ position: "relative", overflowX: "clip" }}>
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
);
