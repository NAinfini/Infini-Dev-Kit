import { motion } from "motion/react";

import type { MotionBreadcrumbProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Breadcrumb with animated separators and hover effects.
 * Theme-aware and motion-gated.
 */
export function MotionBreadcrumb({
  items,
  separator = "/",
  className,
}: MotionBreadcrumbProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");

  return (
    <nav className={className} aria-label="Breadcrumb">
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontFamily: theme.typography.display,
          fontSize: 13,
        }}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isClickable = !isLast && (item.href || item.onClick);

          const linkContent = (
            <span
              style={{
                color: isLast ? theme.palette.text : theme.palette.textMuted,
                fontWeight: isLast ? theme.typography.displayWeight : 400,
              }}
            >
              {item.label}
            </span>
          );

          return (
            <li key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {isClickable ? (
                motionAllowed ? (
                  <motion.a
                    href={item.href}
                    onClick={item.onClick}
                    whileHover={{ color: theme.palette.primary, x: 1 }}
                    transition={transition}
                    style={{
                      color: theme.palette.textMuted,
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {item.label}
                  </motion.a>
                ) : (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    style={{
                      color: theme.palette.textMuted,
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {item.label}
                  </a>
                )
              ) : (
                linkContent
              )}

              {!isLast && (
                <span
                  aria-hidden
                  style={{
                    color: theme.foundation.borderColor,
                    fontSize: 11,
                    userSelect: "none",
                  }}
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
