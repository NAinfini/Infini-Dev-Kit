import { motion } from "motion/react";
import { useCallback, useId, useRef, useState } from "react";

import type { FloatingLabelInputProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Input with animated floating label that rises on focus or when filled.
 * Theme-aware colors, motion-gated animations.
 */
export function FloatingLabelInput({
  label,
  value: controlledValue,
  defaultValue = "",
  onChange,
  type = "text",
  placeholder,
  error,
  disabled,
  focusGlow = false,
  focusGlowColor,
  shakeOnError = true,
  className,
}: FloatingLabelInputProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("focus");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  const value = controlledValue ?? internalValue;
  const isFloating = focused || value.length > 0;
  const borderColor = error ? theme.palette.danger : focused ? theme.palette.primary : theme.foundation.borderColor;
  const glowColor = focusGlowColor ?? theme.palette.primary;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (controlledValue === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e.target.value);
    },
    [controlledValue, onChange],
  );

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    left: 12,
    pointerEvents: "none",
    transformOrigin: "left center",
    color: error ? theme.palette.danger : focused ? theme.palette.primary : theme.palette.textMuted,
    fontFamily: theme.typography.display,
    fontSize: 14,
  };

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${borderColor}`,
    borderRadius: theme.foundation.radius,
    background: theme.foundation.surface,
    transition: motionAllowed ? "border-color 0.2s ease, box-shadow 0.2s ease" : undefined,
    opacity: disabled ? 0.6 : 1,
    boxShadow: focused && focusGlow && motionAllowed
      ? `0 0 0 3px ${glowColor}40, 0 0 12px ${glowColor}20`
      : undefined,
  };

  // Error shake container
  const containerProps = error && shakeOnError && motionAllowed
    ? {
        animate: { x: [0, -4, 4, -3, 3, 0] },
        transition: { duration: 0.4 },
      }
    : {};

  const Container = error && shakeOnError && motionAllowed ? motion.div : "div";

  return (
    <Container className={className} style={{ position: "relative", width: "100%" }} {...containerProps}>
      <div style={wrapperStyle}>
        {/* Floating label */}
        {motionAllowed ? (
          <motion.label
            htmlFor={inputId}
            animate={{
              top: isFloating ? 6 : 16,
              scale: isFloating ? 0.75 : 1,
            }}
            transition={transition}
            style={labelStyle}
          >
            {label}
          </motion.label>
        ) : (
          <label
            htmlFor={inputId}
            style={{
              ...labelStyle,
              top: isFloating ? 6 : 16,
              transform: isFloating ? "scale(0.75)" : "scale(1)",
            }}
          >
            {label}
          </label>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : undefined}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "22px 12px 8px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: theme.palette.text,
            fontFamily: theme.typography.display,
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            fontSize: 12,
            color: theme.palette.danger,
            marginTop: 4,
            paddingLeft: 4,
          }}
        >
          {error}
        </div>
      )}
    </Container>
  );
}
