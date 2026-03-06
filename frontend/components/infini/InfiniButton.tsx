import type { InfiniButtonProps } from "./dispatch-types";
import { useButtonDispatch } from "./use-button-dispatch";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { DepthButton } from "../buttons/DepthButton";
import { GlitchButton } from "../buttons/GlitchButton";
import { ShimmerButton } from "../buttons/ShimmerButton";

/**
 * Unified button that auto-dispatches to DepthButton, GlitchButton, or
 * ShimmerButton based on the active theme's `button.type` and effect signals.
 *
 * Consumers write `<InfiniButton onClick={fn}>Submit</InfiniButton>` —
 * cyberpunk auto-glitches, neu-brutalism auto-depths, default auto-shimmers.
 */
export function InfiniButton({
  children,
  onClick,
  href,
  target,
  before,
  after,
  htmlType = "button",
  loading,
  disabled,
  className,
  overrides,
}: InfiniButtonProps) {
  const dispatch = useButtonDispatch();
  const { theme } = useThemeSnapshot();

  const isDisabled = disabled || loading;
  const content = loading ? (
    <>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: "2px solid currentColor",
          borderTopColor: "transparent",
          animation: "infini-btn-spin 0.6s linear infinite",
        }}
      />
      {children}
      <style>{`@keyframes infini-btn-spin { to { transform: rotate(360deg) } }`}</style>
    </>
  ) : (
    children
  );

  switch (dispatch) {
    case "glitch":
      return (
        <GlitchButton
          onClick={onClick}
          href={href}
          htmlType={htmlType}
          disabled={isDisabled}
          className={className}
          intensity={theme.motion.glitchIntensity != null && theme.motion.glitchIntensity >= 0.7 ? "heavy" : "medium"}
          {...overrides?.glitch}
        >
          {content}
        </GlitchButton>
      );

    case "depth":
      return (
        <DepthButton
          onClick={onClick}
          href={href}
          target={target}
          before={before}
          after={after}
          htmlType={htmlType}
          disabled={isDisabled}
          className={className}
          raiseLevel={theme.button.raiseLevel}
          hoverTilt={false}
          {...overrides?.depth}
        >
          {content}
        </DepthButton>
      );

    case "shimmer":
      return (
        <ShimmerButton
          onClick={onClick}
          before={before}
          after={after}
          htmlType={htmlType}
          disabled={isDisabled}
          className={className}
          {...overrides?.shimmer}
        >
          {content}
        </ShimmerButton>
      );
  }
}
