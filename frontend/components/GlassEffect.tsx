import type { GlassEffectProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";

/**
 * Frosted glass / Apple-style glassmorphism panel.
 * Inspired by nyxui's Apple Glass Effect.
 * Uses backdrop-filter blur with a semi-transparent tinted surface,
 * a subtle inner border, and a specular highlight along the top edge.
 */
export function GlassEffect({
  children,
  blur = 12,
  opacity = 0.15,
  borderOpacity = 0.2,
  tint,
  className,
}: GlassEffectProps) {
  const { theme } = useThemeSnapshot();

  const effectiveTint = tint ?? theme.foundation.surface;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: theme.foundation.radius,
        background: `color-mix(in srgb, ${effectiveTint} ${Math.round(opacity * 100)}%, transparent)`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `${Math.max(1, theme.foundation.borderWidth)}px solid color-mix(in srgb, white ${Math.round(borderOpacity * 100)}%, transparent)`,
        boxShadow: `
          0 8px 32px color-mix(in srgb, black 10%, transparent),
          inset 0 1px 0 color-mix(in srgb, white ${Math.round(borderOpacity * 60)}%, transparent)
        `,
        overflow: "hidden",
      }}
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
