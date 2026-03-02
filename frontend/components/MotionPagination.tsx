import { motion } from "motion/react";
import { useMemo } from "react";

import type { MotionPaginationProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Pagination with animated page transitions and smooth button states.
 * Theme-aware colors and motion-gated animations.
 */
export function MotionPagination({
  total,
  page,
  onChange,
  siblings = 1,
  color,
  shape = "rounded",
  hoverScale = 1.05,
  activeGlow = false,
  className,
}: MotionPaginationProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("press");
  const activeColor = color ?? theme.palette.primary;

  // Build page range with ellipsis
  const pages = useMemo(() => {
    const result: (number | "dots")[] = [];
    const left = Math.max(2, page - siblings);
    const right = Math.min(total - 1, page + siblings);

    result.push(1);
    if (left > 2) result.push("dots");
    for (let i = left; i <= right; i++) result.push(i);
    if (right < total - 1) result.push("dots");
    if (total > 1) result.push(total);

    return result;
  }, [total, page, siblings]);

  const shapeRadius = shape === "pill" ? 999 : shape === "square" ? 2 : theme.foundation.radius;

  const buttonStyle = (isActive: boolean, isDisabled: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 32,
    height: 32,
    padding: "0 6px",
    border: isActive
      ? `1px solid ${activeColor}`
      : `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
    borderRadius: shapeRadius,
    background: isActive ? activeColor : theme.foundation.surface,
    color: isActive ? theme.foundation.background : theme.palette.text,
    fontFamily: theme.typography.display,
    fontSize: 13,
    fontWeight: isActive ? theme.typography.displayWeight : 400,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
    outline: "none",
    boxShadow: isActive && activeGlow ? `0 0 0 3px ${activeColor}40, 0 0 8px ${activeColor}25` : undefined,
  });

  const ArrowButton = ({ direction, disabled }: { direction: "prev" | "next"; disabled: boolean }) => {
    const isPrev = direction === "prev";
    const targetPage = isPrev ? page - 1 : page + 1;

    if (motionAllowed) {
      return (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onChange(targetPage)}
          whileHover={!disabled ? { scale: hoverScale } : undefined}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
          transition={transition}
          style={buttonStyle(false, disabled)}
        >
          {isPrev ? "\u2039" : "\u203A"}
        </motion.button>
      );
    }

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange(targetPage)}
        style={buttonStyle(false, disabled)}
      >
        {isPrev ? "\u2039" : "\u203A"}
      </button>
    );
  };

  return (
    <nav className={className} aria-label="Pagination" style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <ArrowButton direction="prev" disabled={page <= 1} />

      {pages.map((p, idx) => {
        if (p === "dots") {
          return (
            <span
              key={`dots-${idx}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 32,
                height: 32,
                color: theme.palette.textMuted,
                fontSize: 13,
              }}
            >
              &hellip;
            </span>
          );
        }

        const isActive = p === page;

        if (motionAllowed) {
          return (
            <motion.button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              whileHover={!isActive ? { scale: hoverScale } : undefined}
              whileTap={{ scale: 0.95 }}
              transition={transition}
              layout
              style={buttonStyle(isActive, false)}
            >
              {p}
            </motion.button>
          );
        }

        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            style={buttonStyle(isActive, false)}
          >
            {p}
          </button>
        );
      })}

      <ArrowButton direction="next" disabled={page >= total} />
    </nav>
  );
}
