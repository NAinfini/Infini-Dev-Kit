import { GlowBorder, PageTransition, ShimmerButton, TiltCard } from "@infini-dev-kit/frontend/react/motion";

export function CyberpunkExample() {
  return (
    <PageTransition type="slide">
      <GlowBorder>
        <TiltCard>
          <ShimmerButton>Deploy</ShimmerButton>
        </TiltCard>
      </GlowBorder>
    </PageTransition>
  );
}
