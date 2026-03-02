import { motion } from "motion/react";

import type { SidebarCollapseProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Animated sidebar with smooth collapse/expand transitions.
 * Theme-aware and motion-gated.
 */
export function SidebarCollapse({
  children,
  collapsed,
  onToggle,
  expandedWidth = 260,
  collapsedWidth = 60,
  togglePosition = "top",
  collapseStyle = "width",
  borderGlow = false,
  className,
}: SidebarCollapseProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("enter");

  const width = collapsed ? collapsedWidth : expandedWidth;
  const glowShadow = borderGlow && !collapsed ? `1px 0 8px ${theme.palette.primary}25` : undefined;

  const toggleButton = (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: theme.foundation.radius,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        background: theme.foundation.surface,
        color: theme.palette.textMuted,
        cursor: "pointer",
        outline: "none",
        fontSize: 14,
        margin: collapsed ? "0 auto" : undefined,
      }}
    >
      {motionAllowed ? (
        <motion.span
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={transition}
          style={{ display: "inline-flex" }}
        >
          &#9654;
        </motion.span>
      ) : (
        <span style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", display: "inline-flex" }}>
          &#9654;
        </span>
      )}
    </button>
  );

  const sidebar = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {togglePosition === "top" && (
        <div style={{ padding: "0.5rem", display: "flex", justifyContent: collapsed ? "center" : "flex-end" }}>
          {toggleButton}
        </div>
      )}

      <div style={{ flex: 1, overflow: collapsed ? "hidden" : "auto" }}>
        {children}
      </div>

      {togglePosition === "bottom" && (
        <div style={{ padding: "0.5rem", display: "flex", justifyContent: collapsed ? "center" : "flex-end" }}>
          {toggleButton}
        </div>
      )}
    </div>
  );

  if (motionAllowed) {
    const animateProps = collapseStyle === "fade"
      ? { width, opacity: collapsed ? 0.7 : 1 }
      : collapseStyle === "slide"
        ? { width, x: collapsed ? -(expandedWidth - collapsedWidth) * 0.3 : 0 }
        : { width };

    return (
      <motion.aside
        className={className}
        animate={animateProps}
        transition={transition}
        style={{
          borderRight: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
          background: theme.foundation.surface,
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: glowShadow,
        }}
      >
        {sidebar}
      </motion.aside>
    );
  }

  return (
    <aside
      className={className}
      style={{
        width,
        borderRight: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        background: theme.foundation.surface,
        overflow: "hidden",
        flexShrink: 0,
        transition: "width 0.3s ease",
        boxShadow: glowShadow,
      }}
    >
      {sidebar}
    </aside>
  );
}
