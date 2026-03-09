import { forwardRef } from "react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import clsx from "clsx";

import type { SelectStepperItem, SelectStepperProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

/**
 * Increment/decrement value picker that cycles through a list of options.
 * Inspired by @gfazioli/mantine-select-stepper but built on Infini Dev Kit
 * patterns (theme tokens, motion-gating, no Mantine factory dependency).
 */
export const SelectStepper = forwardRef<HTMLDivElement, SelectStepperProps>(
  function SelectStepper({
    items,
    value: controlledValue,
    defaultValue,
    onChange,
    loop = false,
    disabled = false,
    viewWidth = 120,
    animated = true,
    leftIcon,
    rightIcon,
    renderOption,
    className,
    style,
    ...rest
  }, ref) {
    const { theme } = useThemeSnapshot();
    const motionAllowed = useMotionAllowed();

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string | null>(
      defaultValue ?? items[0]?.value ?? null,
    );
    const currentValue = isControlled ? controlledValue : internalValue;
    const currentIndex = items.findIndex((item) => item.value === currentValue);

    const [transitioning, setTransitioning] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const canPrev = loop ? items.length > 1 : currentIndex > 0;
    const canNext = loop ? items.length > 1 : currentIndex < items.length - 1;

    const findNextValid = useCallback(
      (startIndex: number, dir: -1 | 1): number => {
        const len = items.length;
        let idx = startIndex;
        for (let i = 0; i < len; i++) {
          idx = loop ? (idx + dir + len) % len : Math.max(0, Math.min(len - 1, idx + dir));
          if (!items[idx]?.disabled) return idx;
          if (!loop && (idx === 0 || idx === len - 1)) break;
        }
        return startIndex;
      },
      [items, loop],
    );

    const navigate = useCallback(
      (dir: -1 | 1) => {
        if (disabled || (dir === -1 ? !canPrev : !canNext)) return;
        const nextIdx = findNextValid(currentIndex, dir);
        if (nextIdx === currentIndex) return;
        const nextItem = items[nextIdx];
        if (!isControlled) setInternalValue(nextItem.value);
        onChange?.(nextItem.value, nextItem);

        if (animated && motionAllowed) {
          setTransitioning(true);
          timeoutRef.current = setTimeout(() => setTransitioning(false), 250);
        }
      },
      [disabled, canPrev, canNext, findNextValid, currentIndex, items, isControlled, onChange, animated, motionAllowed],
    );

    const handleKey = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); navigate(-1); }
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); navigate(1); }
    };

    const scrollOffset = currentIndex >= 0 ? -currentIndex * 100 : 0;

    const btnStyle: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      minWidth: 28,
      border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
      borderRadius: theme.foundation.radius,
      background: "transparent",
      color: theme.palette.text,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontSize: 16,
      padding: 0,
      transition: motionAllowed ? "background 0.15s, border-color 0.15s" : undefined,
    };

    const disabledBtnStyle: CSSProperties = { ...btnStyle, opacity: 0.35, cursor: "not-allowed" };

    const currentItem: SelectStepperItem | undefined = currentIndex >= 0 ? items[currentIndex] : undefined;

    return (
      <div
        ref={ref}
        className={clsx(className)}
        style={{ display: "inline-flex", alignItems: "center", gap: 0, ...style }}
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKey}
        aria-valuenow={currentIndex >= 0 ? currentIndex : undefined}
        aria-valuemin={0}
        aria-valuemax={items.length - 1}
        aria-valuetext={currentItem?.label}
        {...rest}
      >
        {/* Left arrow */}
        <button
          type="button"
          disabled={disabled || !canPrev}
          onClick={() => navigate(-1)}
          style={disabled || !canPrev ? disabledBtnStyle : btnStyle}
          tabIndex={-1}
          aria-label="Previous"
        >
          {leftIcon ?? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )}
        </button>

        {/* Value viewport */}
        <div
          style={{
            width: viewWidth,
            overflow: "hidden",
            position: "relative",
            borderTop: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
            borderBottom: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
          }}
        >
          <div
            style={{
              display: "flex",
              transform: `translateX(${scrollOffset}%)`,
              transition: animated && motionAllowed && transitioning ? "transform 0.25s ease-in-out" : "none",
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item.value}
                style={{
                  minWidth: viewWidth,
                  width: viewWidth,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 8px",
                  fontFamily: theme.typography.en.body,
                  fontSize: 13,
                  fontWeight: idx === currentIndex ? theme.typography.weights.bold : 400,
                  color: idx === currentIndex ? theme.palette.text : theme.palette.textMuted,
                  userSelect: "none",
                }}
              >
                {renderOption ? renderOption(item, idx === currentIndex) : item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          disabled={disabled || !canNext}
          onClick={() => navigate(1)}
          style={disabled || !canNext ? disabledBtnStyle : btnStyle}
          tabIndex={-1}
          aria-label="Next"
        >
          {rightIcon ?? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);
