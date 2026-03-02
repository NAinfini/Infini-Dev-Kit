import {
  GlowBorder,
  LoadingSkeleton,
  PageTransition,
  ShimmerButton,
  TiltCard,
} from "@infini-dev-kit/frontend/react/motion";

export function MotionShowcase() {
  return (
    <PageTransition type="fade">
      <div style={{ display: "grid", gap: 16 }}>
        <GlowBorder>
          <TiltCard>
            <ShimmerButton>Action</ShimmerButton>
          </TiltCard>
        </GlowBorder>
        <LoadingSkeleton type="card" count={2} shimmer />
      </div>
    </PageTransition>
  );
}
