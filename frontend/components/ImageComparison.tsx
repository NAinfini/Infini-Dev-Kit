import { useCallback, useRef, useState, type MouseEvent, type TouchEvent } from "react";

import type { ImageComparisonProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";

/**
 * Before/after image comparison with a draggable slider divider.
 * Inspired by nyxui's Image Comparison component.
 * Uses clip-path to reveal the "after" layer, with a theme-aware
 * divider handle and optional labels.
 */
export function ImageComparison({
  before,
  after,
  initialPosition = 50,
  beforeLabel = "Before",
  afterLabel = "After",
  height = 300,
  className,
}: ImageComparisonProps) {
  const { theme } = useThemeSnapshot();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(Math.max(0, Math.min(100, initialPosition)));
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (event: MouseEvent<HTMLDivElement>) => {
    dragging.current = true;
    updatePosition(event.clientX);
    event.preventDefault();
  };

  const onPointerMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!dragging.current) {
        return;
      }
      updatePosition(event.clientX);
    },
    [updatePosition],
  );

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (event.touches.length > 0) {
        updatePosition(event.touches[0].clientX);
      }
    },
    [updatePosition],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={(e) => {
        dragging.current = true;
        if (e.touches.length > 0) {
          updatePosition(e.touches[0].clientX);
        }
      }}
      onTouchMove={onTouchMove}
      onTouchEnd={onPointerUp}
      style={{
        position: "relative",
        overflow: "hidden",
        height,
        cursor: "ew-resize",
        userSelect: "none",
        borderRadius: theme.foundation.radius,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
      }}
    >
      {/* Before layer — full width */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {typeof before === "string" ? (
          <img src={before} alt={beforeLabel} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          before
        )}
      </div>

      {/* After layer — clipped by slider position */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {typeof after === "string" ? (
          <img src={after} alt={afterLabel} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          after
        )}
      </div>

      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: 2,
          background: theme.palette.primary,
          transform: "translateX(-50%)",
          zIndex: 2,
          boxShadow: `0 0 8px color-mix(in srgb, ${theme.palette.primary} 50%, transparent)`,
        }}
      />

      {/* Handle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: theme.palette.primary,
          border: `2px solid ${theme.foundation.background}`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.foundation.background,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        ⇔
      </div>

      {/* Labels */}
      <span
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          fontSize: 11,
          fontFamily: theme.typography.mono,
          background: `color-mix(in srgb, ${theme.foundation.surface} 80%, transparent)`,
          padding: "2px 6px",
          borderRadius: 3,
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        {beforeLabel}
      </span>
      <span
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          fontSize: 11,
          fontFamily: theme.typography.mono,
          background: `color-mix(in srgb, ${theme.foundation.surface} 80%, transparent)`,
          padding: "2px 6px",
          borderRadius: 3,
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
