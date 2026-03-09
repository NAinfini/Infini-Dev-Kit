import { motion } from "motion/react";
import { forwardRef } from "react";
import clsx from "clsx";

import type { ImageScannerProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";

const SCAN_AXIS = {
  down: { prop: "top" as const, size: "width" as const, from: "-5%", to: "105%" },
  up: { prop: "bottom" as const, size: "width" as const, from: "-5%", to: "105%" },
  left: { prop: "right" as const, size: "height" as const, from: "-5%", to: "105%" },
  right: { prop: "left" as const, size: "height" as const, from: "-5%", to: "105%" },
} as const;

/**
 * Image/content scanner with a futuristic scanning line effect.
 * Inspired by nyxui's Image Scanner.
 * A glowing line sweeps across the content in the specified direction,
 * creating a sci-fi scanning/analyzing effect.
 */
export const ImageScanner = forwardRef<HTMLDivElement, ImageScannerProps>(
  function ImageScanner({
    children,
    scanColor,
    duration = 2,
    direction = "down",
    autoStart = true,
    loop = true,
    lineWidth = 2,
    glowSpread = 20,
    className,
    style,
    ...rest
  }, ref) {
    const { theme } = useThemeSnapshot();
    const fullMotion = useFullMotion();

    const effectiveColor = scanColor ?? theme.palette.primary;
    const axis = SCAN_AXIS[direction];
    const isVertical = direction === "down" || direction === "up";

    if (!fullMotion) {
      return (
        <div ref={ref} className={clsx(className)} style={{ position: "relative", overflow: "hidden", ...style }} {...rest}>
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={clsx(className)}
        style={{ position: "relative", overflow: "hidden", ...style }}
        {...rest}
      >
        {children}

        {/* Scan line */}
        {autoStart && (
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              [axis.prop]: 0,
              left: isVertical ? 0 : undefined,
              top: !isVertical ? 0 : undefined,
              [isVertical ? "width" : "height"]: "100%",
              [isVertical ? "height" : "width"]: lineWidth,
              background: effectiveColor,
              boxShadow: `
                0 0 ${glowSpread}px ${effectiveColor},
                0 0 ${glowSpread * 2}px color-mix(in srgb, ${effectiveColor} 50%, transparent),
                0 0 ${glowSpread * 3}px color-mix(in srgb, ${effectiveColor} 25%, transparent)
              `,
              pointerEvents: "none",
              zIndex: 1,
            }}
            animate={{ [axis.prop]: [axis.from, axis.to] }}
            transition={{
              duration,
              ease: "linear",
              repeat: loop ? Number.POSITIVE_INFINITY : 0,
              repeatDelay: 0.5,
            }}
          />
        )}

        {/* Scan reveal gradient — fades content behind the scan line */}
        {autoStart && (
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: isVertical
                ? `linear-gradient(to ${direction}, color-mix(in srgb, ${effectiveColor} 6%, transparent) 0%, transparent 30%)`
                : `linear-gradient(to ${direction}, color-mix(in srgb, ${effectiveColor} 6%, transparent) 0%, transparent 30%)`,
              pointerEvents: "none",
              zIndex: 0,
              mixBlendMode: "screen",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: duration * 2,
              repeat: loop ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Corner brackets for sci-fi framing */}
        <ScanCorners color={effectiveColor} />
      </div>
    );
  }
);

function ScanCorners({ color }: { color: string }) {
  const cornerStyle = {
    position: "absolute" as const,
    width: 16,
    height: 16,
    pointerEvents: "none" as const,
    zIndex: 2,
  };

  const borderWidth = 2;

  return (
    <>
      <span
        aria-hidden
        style={{
          ...cornerStyle,
          top: 4,
          left: 4,
          borderTop: `${borderWidth}px solid ${color}`,
          borderLeft: `${borderWidth}px solid ${color}`,
        }}
      />
      <span
        aria-hidden
        style={{
          ...cornerStyle,
          top: 4,
          right: 4,
          borderTop: `${borderWidth}px solid ${color}`,
          borderRight: `${borderWidth}px solid ${color}`,
        }}
      />
      <span
        aria-hidden
        style={{
          ...cornerStyle,
          bottom: 4,
          left: 4,
          borderBottom: `${borderWidth}px solid ${color}`,
          borderLeft: `${borderWidth}px solid ${color}`,
        }}
      />
      <span
        aria-hidden
        style={{
          ...cornerStyle,
          bottom: 4,
          right: 4,
          borderBottom: `${borderWidth}px solid ${color}`,
          borderRight: `${borderWidth}px solid ${color}`,
        }}
      />
    </>
  );
}
