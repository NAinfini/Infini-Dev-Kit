import { forwardRef, useCallback, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import { useMergedRef } from "../../../hooks/use-merged-ref";
import clsx from "clsx";

import type { ImageComparisonProps } from "../../../motion-types";

/**
 * Before/after image comparison with a draggable slider divider.
 * Inspired by nyxui's Image Comparison component.
 * Uses clip-path to reveal the "after" layer, with a theme-aware
 * divider handle and optional labels.
 */
export const ImageComparison = forwardRef<HTMLDivElement, ImageComparisonProps>(
  function ImageComparison({
    before,
    after,
    initialPosition = 50,
    beforeLabel = "Before",
    afterLabel = "After",
    height = 300,
    className,
    style,
    ...rest
  }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(containerRef, ref);
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

    const STEP = 2;
    const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        setPosition((p) => Math.max(0, p - STEP));
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        setPosition((p) => Math.min(100, p + STEP));
      } else if (event.key === "Home") {
        event.preventDefault();
        setPosition(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setPosition(100);
      }
    }, []);

    return (
      <div
        ref={(node) => {
          mergedRef(node);
        }}
        className={clsx(className)}
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
          borderRadius: "var(--infini-radius)",
          border: `var(--infini-border-width) solid var(--infini-color-border)`,
          ...style,
        }}
        {...rest}
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
            background: "var(--infini-color-primary)",
            transform: "translateX(-50%)",
            zIndex: 2,
            boxShadow: "0 0 8px color-mix(in srgb, var(--infini-color-primary) 50%, transparent)",
          }}
        />

        {/* Handle */}
        <div
          role="slider"
          aria-label="Image comparison slider"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={onKeyDown}
          style={{
            position: "absolute",
            top: "50%",
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--infini-color-primary)",
            border: "2px solid var(--infini-color-bg)",
            boxShadow: "var(--infini-shadow)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--infini-color-bg)",
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
            fontFamily: "var(--infini-font-mono)",
            background: "color-mix(in srgb, var(--infini-color-surface) 80%, transparent)",
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
            fontFamily: "var(--infini-font-mono)",
            background: "color-mix(in srgb, var(--infini-color-surface) 80%, transparent)",
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
);
