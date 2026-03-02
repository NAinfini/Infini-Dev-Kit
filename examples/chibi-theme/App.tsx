import { PageTransition, ShimmerButton, TiltCard } from "@infini-dev-kit/frontend/react/motion";

export function ChibiExample() {
  return (
    <PageTransition type="scale">
      <TiltCard>
        <ShimmerButton>Start</ShimmerButton>
      </TiltCard>
    </PageTransition>
  );
}
