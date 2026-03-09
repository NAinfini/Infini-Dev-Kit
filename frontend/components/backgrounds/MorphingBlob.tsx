import { forwardRef } from "react";
import { motion } from "motion/react";
import { useMemo } from "react";
import clsx from "clsx";

import type { MorphingBlobProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";

const BLOB_PATHS = [
  "M44.5,-51.3C55.2,-40.3,60,-24.8,61.6,-9.3C63.2,6.2,61.5,21.7,53.5,33.9C45.5,46.2,31.2,55.2,15,59.3C-1.2,63.3,-19.3,62.4,-33.7,54.7C-48.2,47,-59,32.5,-63.6,16.1C-68.2,-0.3,-66.5,-18.5,-57.8,-31.8C-49.1,-45.2,-33.3,-53.6,-17.6,-56.8C-1.9,-60,13.7,-58.1,27.2,-54.2C40.6,-50.3,51.8,-44.5,44.5,-51.3Z",
  "M38.3,-46.5C50.4,-37.8,61.5,-26.2,65.3,-12.3C69.1,1.5,65.6,17.5,56.8,29.8C48,42.2,33.8,50.8,18.2,55.8C2.5,60.9,-14.5,62.3,-28.2,56.3C-42,50.3,-52.4,36.8,-58.1,21.8C-63.8,6.8,-64.8,-9.8,-58.6,-22.9C-52.5,-36,-39.3,-45.6,-25.8,-53.5C-12.2,-61.3,1.7,-67.4,14.5,-65.2C27.3,-63,38.9,-52.5,38.3,-46.5Z",
  "M43.8,-50.3C54.8,-42.8,60.3,-27.8,62.6,-12.7C64.9,2.5,64,17.8,56.8,29.5C49.5,41.2,35.8,49.2,21.2,53.5C6.5,57.8,-9.2,58.3,-23.8,53.5C-38.3,48.7,-51.8,38.5,-59.5,24.2C-67.2,9.8,-69.2,-8.8,-62.3,-22.8C-55.5,-36.8,-39.8,-46.2,-25,-52.3C-10.2,-58.5,3.7,-61.5,17.3,-59.2C30.8,-56.8,44,-54,43.8,-50.3Z",
];

/**
 * Animated morphing blob background.
 * Inspired by nyxui's Morphing Blob component.
 * Renders soft gradient blobs that continuously morph shape and float,
 * creating a dynamic, organic background effect.
 */
export const MorphingBlob = forwardRef<HTMLDivElement, MorphingBlobProps>(
  function MorphingBlob({
    count = 3,
    colors,
    opacity = 0.35,
    className,
    style,
    children,
    ...rest
  }, ref) {
    const { theme } = useThemeSnapshot();
    const fullMotion = useFullMotion();

    const defaultColors = useMemo(
      () => [theme.palette.primary, theme.palette.accent, theme.palette.secondary],
      [theme.palette.primary, theme.palette.accent, theme.palette.secondary],
    );

    const blobColors = colors ?? defaultColors;

    const blobs = useMemo(() => {
      return Array.from({ length: Math.max(1, Math.min(count, 6)) }, (_, i) => ({
        id: i,
        color: blobColors[i % blobColors.length],
        path: BLOB_PATHS[i % BLOB_PATHS.length],
        // Stagger positions so blobs don't stack exactly
        x: 20 + (i * 25) % 60,
        y: 15 + (i * 30) % 55,
        scale: 0.8 + (i % 3) * 0.15,
        duration: 8 + i * 2.5,
      }));
    }, [count, blobColors]);

    return (
      <div
        ref={ref}
        className={clsx(className)}
        style={{
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        {/* Blob layer */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity,
            filter: "blur(40px)",
          }}
        >
          {blobs.map((blob) => (
            <motion.svg
              key={blob.id}
              viewBox="-100 -100 200 200"
              style={{
                position: "absolute",
                left: `${blob.x}%`,
                top: `${blob.y}%`,
                width: `${blob.scale * 280}px`,
                height: `${blob.scale * 280}px`,
                transform: "translate(-50%, -50%)",
              }}
              animate={
                fullMotion
                  ? {
                      x: [0, 15, -10, 0],
                      y: [0, -12, 8, 0],
                      rotate: [0, 15, -10, 0],
                      scale: [1, 1.08, 0.95, 1],
                    }
                  : undefined
              }
              transition={
                fullMotion
                  ? {
                      duration: blob.duration,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                      delay: blob.id * 1.2,
                    }
                  : undefined
              }
            >
              <path d={blob.path} fill={blob.color} />
            </motion.svg>
          ))}
        </div>

        {/* Content rendered above blobs */}
        {children && (
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        )}
      </div>
    );
  }
);
