import { forwardRef } from "react";
import clsx from "clsx";

import type { GlassEffectProps } from "../../motion-types";

/**
 * Frosted glass / Apple-style glassmorphism panel.
 * Inspired by nyxui's Apple Glass Effect.
 * Uses backdrop-filter blur with a semi-transparent tinted surface,
 * a subtle inner border, and a specular highlight along the top edge.
 */
export const GlassEffect = forwardRef<HTMLDivElement, GlassEffectProps>(
  function GlassEffect({
    children,
    blur = 12,
    opacity = 0.15,
    borderOpacity = 0.2,
    tint,
    className,
    style,
    ...rest
  }, ref) {
    const effectiveTint = tint ?? "var(--infini-color-surface)";

    return (
      <div
        ref={ref}
        className={clsx(className)}
        style={{
          position: "relative",
          borderRadius: "var(--infini-radius)",
          background: `color-mix(in srgb, ${effectiveTint} ${Math.round(opacity * 100)}%, transparent)`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          border: `max(1px, var(--infini-border-width, 1px)) solid color-mix(in srgb, white ${Math.round(borderOpacity * 100)}%, transparent)`,
          boxShadow: `
            0 8px 32px color-mix(in srgb, black 10%, transparent),
            inset 0 1px 0 color-mix(in srgb, white ${Math.round(borderOpacity * 60)}%, transparent)
          `,
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        {/* Specular highlight along top */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, white ${Math.round(borderOpacity * 120)}%, transparent), transparent)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </div>
    );
  }
);
