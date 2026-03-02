import { AnimatePresence, motion } from "motion/react";

import type { ConfirmDialogProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Confirmation dialog with backdrop blur, scale-in animation,
 * and animated button states. Theme-aware and motion-gated.
 */
export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  blur = true,
  entranceStyle = "scale",
  overlayOpacity = 0.5,
  className,
}: ConfirmDialogProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("overlay-open");

  const confirmBg = confirmVariant === "danger" ? theme.palette.danger : theme.palette.primary;

  // Entrance animation variants based on entranceStyle
  const entranceVariants = {
    scale: { initial: { scale: 0.9, opacity: 0, y: 10 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.9, opacity: 0, y: 10 } },
    "slide-up": { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 60 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    drop: { initial: { opacity: 0, y: -40, scale: 1.05 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -40, scale: 1.05 } },
  };

  const variant = entranceVariants[entranceStyle];

  return (
    <AnimatePresence>
      {opened && (
        <motion.div
          initial={fullMotion ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={fullMotion ? { opacity: 0 } : undefined}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(0, 0, 0, ${overlayOpacity})`,
            backdropFilter: blur && motionAllowed ? "blur(8px)" : undefined,
            WebkitBackdropFilter: blur && motionAllowed ? "blur(8px)" : undefined,
          }}
        >
          <motion.div
            className={className}
            onClick={(e) => e.stopPropagation()}
            initial={fullMotion ? variant.initial : { opacity: 0 }}
            animate={fullMotion ? variant.animate : { opacity: 1 }}
            exit={fullMotion ? variant.exit : { opacity: 0 }}
            transition={transition}
            style={{
              background: theme.foundation.surface,
              border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
              borderRadius: theme.foundation.radius * 1.5,
              padding: "1.5rem",
              minWidth: 320,
              maxWidth: 440,
              boxShadow: `0 12px 40px rgba(0, 0, 0, 0.25)`,
            }}
          >
            {/* Title */}
            {title && (
              <div
                style={{
                  fontFamily: theme.typography.display,
                  fontWeight: theme.typography.displayWeight,
                  fontSize: 16,
                  color: theme.palette.text,
                  marginBottom: 8,
                }}
              >
                {title}
              </div>
            )}

            {/* Message */}
            <div
              style={{
                fontSize: 14,
                color: theme.palette.textMuted,
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              {message}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={motionAllowed ? { scale: 1.02 } : undefined}
                whileTap={motionAllowed ? { scale: 0.98 } : undefined}
                style={{
                  padding: "0.5rem 1rem",
                  border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
                  borderRadius: theme.foundation.radius,
                  background: theme.foundation.surface,
                  color: theme.palette.text,
                  fontFamily: theme.typography.display,
                  fontSize: 13,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {cancelLabel}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                whileHover={motionAllowed ? { scale: 1.02 } : undefined}
                whileTap={motionAllowed ? { scale: 0.98 } : undefined}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: theme.foundation.radius,
                  background: confirmBg,
                  color: theme.foundation.background,
                  fontFamily: theme.typography.display,
                  fontWeight: theme.typography.displayWeight,
                  fontSize: 13,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
