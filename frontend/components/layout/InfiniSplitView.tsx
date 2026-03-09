import { forwardRef } from "react";
import { useRef, useState, useCallback } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useMergedRef } from "@mantine/hooks";

export type InfiniSplitViewProps = {
  left: ReactNode;
  right: ReactNode;
  initialSplit?: number;
  minLeft?: number;
  minRight?: number;
  direction?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
};

export const InfiniSplitView = forwardRef<HTMLDivElement, InfiniSplitViewProps>(
  function InfiniSplitView({
    left,
    right,
    initialSplit = 50,
    minLeft = 20,
    minRight = 20,
    direction = "horizontal",
    className,
    style,
    ...rest
  }, ref) {
    const [split, setSplit] = useState(initialSplit);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRef(ref, containerRef);
    const dragging = useRef(false);

    const isHorizontal = direction === "horizontal";

    const onPointerDown = useCallback(() => {
      dragging.current = true;
      document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";

      const onPointerMove = (e: PointerEvent) => {
        if (!dragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const pos = isHorizontal
          ? ((e.clientX - rect.left) / rect.width) * 100
          : ((e.clientY - rect.top) / rect.height) * 100;
        setSplit(Math.max(minLeft, Math.min(100 - minRight, pos)));
      };

      const onPointerUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
      };

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }, [isHorizontal, minLeft, minRight]);

    return (
      <div
        ref={mergedRef}
        className={className}
        style={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        <div style={{ [isHorizontal ? "width" : "height"]: `${split}%`, overflow: "auto", minWidth: 0, minHeight: 0 }}>
          {left}
        </div>
        <div
          role="separator"
          aria-orientation={isHorizontal ? "vertical" : "horizontal"}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onKeyDown={(e) => {
            const step = 2;
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") setSplit((s) => Math.max(minLeft, s - step));
            if (e.key === "ArrowRight" || e.key === "ArrowDown") setSplit((s) => Math.min(100 - minRight, s + step));
          }}
          style={{
            flexShrink: 0,
            [isHorizontal ? "width" : "height"]: 6,
            background: "var(--infini-color-border, var(--mantine-color-gray-3))",
            cursor: isHorizontal ? "col-resize" : "row-resize",
            transition: "background 0.15s",
          }}
        />
        <div style={{ flex: 1, overflow: "auto", minWidth: 0, minHeight: 0 }}>
          {right}
        </div>
      </div>
    );
  }
);
