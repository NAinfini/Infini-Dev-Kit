import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

import type { MotionAccordionProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Accordion with smooth expand/collapse animation and rotating chevron.
 * Theme-aware colors and motion-gated animations.
 */
export function MotionAccordion({
  items,
  multiple = false,
  defaultOpenKeys = [],
  chevronPosition = "right",
  expandStyle = "height",
  activeHighlight = 0.05,
  className,
}: MotionAccordionProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("enter");
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(defaultOpenKeys));

  const toggle = useCallback(
    (key: string) => {
      setOpenKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          if (!multiple) next.clear();
          next.add(key);
        }
        return next;
      });
    },
    [multiple],
  );

  const chevron = (isOpen: boolean) => {
    const svg = (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ display: "block" }}
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    if (!motionAllowed) {
      return (
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-flex", transition: "transform 0.2s" }}>
          {svg}
        </span>
      );
    }

    return (
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={transition}
        style={{ display: "inline-flex" }}
      >
        {svg}
      </motion.span>
    );
  };

  return (
    <div
      className={className}
      style={{
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        borderRadius: theme.foundation.radius,
        overflow: "hidden",
      }}
    >
      {items.map((item, idx) => {
        const isOpen = openKeys.has(item.key);
        return (
          <div key={item.key}>
            {idx > 0 && (
              <div
                style={{
                  height: theme.foundation.borderWidth,
                  background: theme.foundation.borderColor,
                }}
              />
            )}

            {/* Header */}
            <button
              type="button"
              onClick={() => !item.disabled && toggle(item.key)}
              disabled={item.disabled}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: chevronPosition === "left" ? "row-reverse" : "row",
                justifyContent: "space-between",
                gap: 8,
                padding: "0.7rem 1rem",
                background: isOpen && activeHighlight > 0 ? `color-mix(in srgb, ${theme.palette.primary} ${Math.round(activeHighlight * 100)}%, ${theme.foundation.surface})` : theme.foundation.surface,
                border: "none",
                cursor: item.disabled ? "not-allowed" : "pointer",
                color: theme.palette.text,
                fontFamily: theme.typography.display,
                fontWeight: theme.typography.displayWeight,
                fontSize: 14,
                textAlign: "left",
                outline: "none",
                opacity: item.disabled ? 0.5 : 1,
                transition: motionAllowed ? "background 0.2s ease" : undefined,
              }}
            >
              <span style={{ flex: 1 }}>{item.title}</span>
              {chevron(isOpen)}
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={fullMotion ? (
                    expandStyle === "height" ? { height: 0, opacity: 0 } :
                    expandStyle === "slide" ? { height: 0, opacity: 0, x: -20 } :
                    { opacity: 0 }
                  ) : { opacity: 0 }}
                  animate={fullMotion ? (
                    expandStyle === "height" ? { height: "auto", opacity: 1 } :
                    expandStyle === "slide" ? { height: "auto", opacity: 1, x: 0 } :
                    { opacity: 1 }
                  ) : { opacity: 1 }}
                  exit={fullMotion ? (
                    expandStyle === "height" ? { height: 0, opacity: 0 } :
                    expandStyle === "slide" ? { height: 0, opacity: 0, x: -20 } :
                    { opacity: 0 }
                  ) : { opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "0.6rem 1rem 0.8rem",
                      color: theme.palette.textMuted,
                      fontSize: 13,
                      lineHeight: 1.5,
                      background: theme.foundation.surface,
                    }}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
