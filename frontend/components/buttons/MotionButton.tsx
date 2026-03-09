import { Button } from "@mantine/core";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

import type { ThemeId } from "../../theme/theme-specs";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";
import {
  getButtonRipplePalette,
  getButtonVariants,
} from "../../hooks/variants/button-variants";

interface ThemeLoadingIndicatorProps {
  themeId: ThemeId;
  color: string;
  animated: boolean;
}

interface ButtonRipple {
  id: number;
  color: string;
  delayMs: number;
  x: number;
  y: number;
  size: number;
  scale: number[];
  opacity: number[];
}

type MotionButtonLayoutProps = {
  block?: boolean;
  fullWidth?: boolean;
};

type LegacyButtonType = "default" | "primary" | "dashed" | "link" | "text";

export type MotionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  loading?: boolean;
  size?: "small" | "middle" | "large";
  type?: LegacyButtonType;
  danger?: boolean;
  htmlType?: "button" | "submit" | "reset";
  block?: boolean;
  fullWidth?: boolean;
};

function resolveMantineVariant(type: LegacyButtonType | undefined): "filled" | "default" | "outline" | "subtle" {
  if (type === "primary") return "filled";
  if (type === "dashed") return "outline";
  if (type === "link" || type === "text") return "subtle";
  return "default";
}

function resolveMantineSize(size: MotionButtonProps["size"]): "xs" | "sm" | "md" {
  if (size === "small") return "xs";
  if (size === "large") return "md";
  return "sm";
}

export function resolveMotionButtonWrapperStyle(props: MotionButtonLayoutProps): CSSProperties {
  if (props.block || props.fullWidth) {
    return {
      position: "relative",
      display: "flex",
      width: "100%",
      alignSelf: "stretch",
    };
  }

  return {
    position: "relative",
    display: "inline-flex",
    alignSelf: "flex-start",
  };
}

function ThemeLoadingIndicator({ themeId, color, animated }: ThemeLoadingIndicatorProps) {
  if (!animated) {
    return (
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          display: "inline-block",
          border: "2px solid currentColor",
          opacity: 0.7,
        }}
      />
    );
  }

  if (themeId === "chibi") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {[0, 1, 2].map((index) => (
          <motion.span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={{
              width: 4,
              height: 4,
              borderRadius: 999,
              display: "inline-block",
              backgroundColor: color,
            }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.48, repeat: Number.POSITIVE_INFINITY, delay: index * 0.08 }}
          />
        ))}
      </span>
    );
  }

  if (themeId === "cyberpunk") {
    return (
      <span
        style={{
          position: "relative",
          width: 18,
          height: 8,
          overflow: "hidden",
          border: `1px solid ${color}`,
          borderRadius: 2,
          display: "inline-block",
        }}
      >
        <motion.span
          style={{ position: "absolute", insetBlock: 1, width: 8, backgroundColor: color }}
          animate={{ x: [-8, 18] }}
          transition={{ duration: 0.65, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        />
      </span>
    );
  }

  if (themeId === "neu-brutalism") {
    return (
      <motion.span
        style={{ width: 9, height: 9, border: "2px solid currentColor", display: "inline-block", borderRadius: 1 }}
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 0.6, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      />
    );
  }

  if (themeId === "black-gold" || themeId === "red-gold") {
    return (
      <motion.span
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          border: `2px solid color-mix(in srgb, ${color} 25%, transparent)`,
          borderTopColor: color,
          display: "inline-block",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      />
    );
  }

  return (
    <motion.span
      style={{
        width: 14,
        height: 14,
        borderRadius: 999,
        border: "2px solid rgba(37,99,235,0.2)",
        borderTopColor: color,
        display: "inline-block",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
    />
  );
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(function MotionButton({
  children,
  loading,
  disabled,
  className,
  style,
  type,
  danger,
  htmlType,
  size,
  block,
  fullWidth,
  onClick,
  ...props
}, ref) {
  const { state, theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("press");
  const variants = getButtonVariants(state.themeId);
  const interactionVariants = {
    ...variants,
    reducedHover: { opacity: 0.94 },
    reducedTap: { opacity: 0.88 },
  };
  const isLoading = typeof loading === "boolean" ? loading : Boolean(loading);
  const ripplePalette = getButtonRipplePalette(state.themeId);
  const rippleId = useRef(0);
  const [ripples, setRipples] = useState<ButtonRipple[]>([]);

  const removeRipple = (id: number) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  };

  const spawnRipple = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!fullMotion || disabled || isLoading) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.65;
    const centerX = event.clientX - rect.left - size / 2;
    const centerY = event.clientY - rect.top - size / 2;
    const nextId = rippleId.current + 1;
    rippleId.current = nextId;

    const nextRipples: ButtonRipple[] = [
      {
        id: nextId,
        color: ripplePalette.primary,
        delayMs: 0,
        x: centerX,
        y: centerY,
        size,
        scale: state.themeId === "chibi" ? [0, 2.1, 2] : [0, 2],
        opacity: [0.3, 0],
      },
    ];

    if (ripplePalette.secondary) {
      const secondId = rippleId.current + 1;
      rippleId.current = secondId;
      nextRipples.push({
        id: secondId,
        color: ripplePalette.secondary,
        delayMs: 50,
        x: centerX - 1,
        y: centerY + 1,
        size,
        scale: [0, 2],
        opacity: [0.28, 0],
      });
    }

    setRipples((current) => [...current.slice(-4), ...nextRipples]);
  };

  if (!motionAllowed) {
    return (
      <Button
        ref={ref}
        {...props}
        onClick={onClick}
        type={htmlType}
        variant={resolveMantineVariant(type)}
        color={danger ? "infini-danger" : undefined}
        size={resolveMantineSize(size)}
        className={className}
        style={style}
        disabled={disabled}
        loading={loading}
        fullWidth={Boolean(block || fullWidth)}
      >
        {children}
      </Button>
    );
  }

  return (
    <motion.div
      style={resolveMotionButtonWrapperStyle({ block, fullWidth })}
      initial="rest"
      animate="rest"
      whileHover={!disabled && !isLoading ? (fullMotion ? "hover" : "reducedHover") : "rest"}
      whileTap={!disabled && !isLoading ? (fullMotion ? "tap" : "reducedTap") : "rest"}
      variants={interactionVariants}
      transition={transition}
      onPointerDown={spawnRipple}
    >
      <Button
        ref={ref}
        {...props}
        onClick={onClick}
        type={htmlType}
        variant={resolveMantineVariant(type)}
        color={danger ? "infini-danger" : undefined}
        size={resolveMantineSize(size)}
        className={className}
        style={{
          ...style,
          position: "relative",
          overflow: "visible",
          outline: "none",
        }}
        disabled={disabled || isLoading}
        loading={false}
        fullWidth={Boolean(block || fullWidth)}
        aria-busy={isLoading}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <AnimatePresence initial={false}>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  borderRadius: "50%",
                  background: ripple.color,
                  pointerEvents: "none",
                }}
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: ripple.scale, opacity: ripple.opacity }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: ripple.delayMs / 1000 }}
                onAnimationComplete={() => removeRipple(ripple.id)}
              />
            ))}
          </AnimatePresence>
        </span>

        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.span
              key="loading"
              style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}
              initial={{ opacity: 0 }}
              animate={fullMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
              exit={fullMotion ? { opacity: 0, y: -2 } : { opacity: 0 }}
            >
              <ThemeLoadingIndicator themeId={state.themeId} color={theme.palette.primary} animated={fullMotion} />
              <span>Loading</span>
            </motion.span>
          ) : (
            <motion.span
              key="content"
              style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center" }}
              initial={{ opacity: 0 }}
              animate={fullMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
              exit={fullMotion ? { opacity: 0, y: -2 } : { opacity: 0 }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
});
