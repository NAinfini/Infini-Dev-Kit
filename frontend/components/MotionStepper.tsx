import { motion } from "motion/react";

import type { MotionStepperProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Stepper with animated step transitions, connectors, and checkmarks.
 * Theme-aware colors and motion-gated animations.
 */
export function MotionStepper({
  items,
  activeStep,
  onStepChange,
  allowStepClick = true,
  orientation = "horizontal",
  color,
  completedIcon = "check",
  animatedConnector = true,
  activeGlow = false,
  className,
}: MotionStepperProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("enter");
  const activeColor = color ?? theme.palette.primary;
  const isVertical = orientation === "vertical";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: isVertical ? "flex-start" : "center",
        gap: 0,
      }}
    >
      {items.map((item, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;
        const isClickable = allowStepClick && idx <= activeStep && onStepChange;

        const stepColor = isCompleted || isActive ? activeColor : theme.palette.textMuted;

        return (
          <div
            key={item.key}
            style={{
              display: "flex",
              flexDirection: isVertical ? "row" : "column",
              alignItems: "center",
              flex: idx < items.length - 1 ? 1 : undefined,
              gap: isVertical ? 12 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isVertical ? "column" : "row",
                alignItems: "center",
                flex: idx < items.length - 1 ? 1 : undefined,
                width: isVertical ? undefined : "100%",
              }}
            >
              {/* Step circle */}
              <motion.button
                type="button"
                onClick={() => isClickable && onStepChange!(idx)}
                disabled={!isClickable}
                animate={fullMotion ? { scale: isActive ? 1.1 : 1 } : undefined}
                transition={transition}
                style={{
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  borderRadius: "50%",
                  border: `2px solid ${stepColor}`,
                  background: isCompleted || isActive ? stepColor : "transparent",
                  color: isCompleted || isActive ? theme.foundation.background : stepColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: theme.typography.display,
                  cursor: isClickable ? "pointer" : "default",
                  outline: "none",
                  padding: 0,
                  transition: motionAllowed ? "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s" : undefined,
                  boxShadow: isActive && activeGlow ? `0 0 0 3px ${activeColor}40, 0 0 10px ${activeColor}30` : undefined,
                }}
              >
                {isCompleted
                  ? completedIcon === "check" ? "\u2713"
                  : completedIcon === "filled" ? "\u25CF"
                  : idx + 1
                  : idx + 1}
              </motion.button>

              {/* Connector line */}
              {idx < items.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    [isVertical ? "width" : "height"]: 2,
                    [isVertical ? "height" : "width"]: undefined,
                    minWidth: isVertical ? 2 : undefined,
                    minHeight: isVertical ? 24 : 2,
                    marginInline: isVertical ? 0 : 4,
                    marginBlock: isVertical ? 4 : 0,
                    alignSelf: isVertical ? "flex-start" : undefined,
                    marginLeft: isVertical ? 13 : undefined,
                    background: idx < activeStep ? activeColor : theme.foundation.borderColor,
                    borderRadius: 1,
                    transition: motionAllowed && animatedConnector ? "background 0.3s ease" : undefined,
                  }}
                />
              )}
            </div>

            {/* Label + Description below (horizontal) or beside (vertical) */}
            {!isVertical && (
              <div style={{ textAlign: "center", marginTop: 6, minWidth: 60 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? theme.typography.displayWeight : 400,
                    color: isActive ? theme.palette.text : theme.palette.textMuted,
                    fontFamily: theme.typography.display,
                  }}
                >
                  {item.label}
                </div>
                {item.description && (
                  <div style={{ fontSize: 11, color: theme.palette.textMuted, marginTop: 2 }}>
                    {item.description}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
