import { motion } from "motion/react";
import { useState, type ReactNode, type CSSProperties, cloneElement, isValidElement } from "react";

export interface SlideIconWrapperProps {
  /** Button or any element to wrap */
  children: ReactNode;
  /** Icon to slide in */
  icon: ReactNode;
  /** Icon container width in px (default: 40) */
  iconWidth?: number;
  /** Icon overlay background color - before hover (default: transparent) */
  iconBgBefore?: string;
  /** Icon overlay background color - after hover (default: same as iconBgBefore) */
  iconBgAfter?: string;
  /** Icon color - before hover (default: currentColor) */
  iconColorBefore?: string;
  /** Icon color - after hover (default: same as iconColorBefore) */
  iconColorAfter?: string;
  /** Disabled state (prevents hover effect) */
  disabled?: boolean;
}

/**
 * Wrapper that adds slide-icon effect to any button.
 * Icon is visible on the right side initially, then slides to cover the button on hover.
 */
export function SlideIconWrapper({
  children,
  icon,
  iconWidth = 40,
  iconBgBefore = "transparent",
  iconBgAfter,
  iconColorBefore = "currentColor",
  iconColorAfter,
  disabled = false,
}: SlideIconWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  const finalIconBgAfter = iconBgAfter ?? iconBgBefore;
  const finalIconColorAfter = iconColorAfter ?? iconColorBefore;

  // Clone children to add padding-right for icon space
  const childElement = isValidElement<{ style?: CSSProperties }>(children) ? children : null;
  const childrenWithPadding = childElement
    ? cloneElement(childElement, {
        style: {
          ...(childElement.props.style || {}),
          paddingRight: `${iconWidth + 8}px`,
        },
      })
    : children;

  const wrapperStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  return (
    <div
      style={wrapperStyle}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ opacity: isHovered ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {childrenWithPadding}
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 2,
          clipPath: "inset(0 0 0 0 round var(--infini-radius, 6px))",
        }}
        animate={{
          width: isHovered ? "100%" : iconWidth,
          backgroundColor: isHovered ? finalIconBgAfter : iconBgBefore,
          color: isHovered ? finalIconColorAfter : iconColorBefore,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {icon}
      </motion.div>
    </div>
  );
}
