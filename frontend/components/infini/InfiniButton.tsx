import type { InfiniButtonProps } from "./dispatch-types";
import { useButtonDispatch } from "./use-button-dispatch";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { DepthButton } from "../DepthButton";
import { GlitchButton } from "../GlitchButton";
import { ShimmerButton } from "../ShimmerButton";

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
  disabled,
  className,
  overrides,
}: InfiniButtonProps) {
  const dispatch = useButtonDispatch();
  const { theme } = useThemeSnapshot();

  switch (dispatch) {
    case "glitch":
      return (
        <GlitchButton
          onClick={onClick}
          href={href}
          disabled={disabled}
          className={className}
          intensity={theme.motion.glitchIntensity != null && theme.motion.glitchIntensity >= 0.7 ? "heavy" : "medium"}
          {...overrides?.glitch}
        >
          {children}
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
          disabled={disabled}
          className={className}
          raiseLevel={theme.button.raiseLevel}
          {...overrides?.depth}
        >
          {children}
        </DepthButton>
      );

    case "shimmer":
      return (
        <ShimmerButton
          onClick={onClick}
          before={before}
          after={after}
          disabled={disabled}
          className={className}
          {...overrides?.shimmer}
        >
          {children}
        </ShimmerButton>
      );
  }
}
