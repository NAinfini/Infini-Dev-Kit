import { PageTransition, ShimmerButton } from "@infini-dev-kit/frontend/react/motion";

export function NeuBrutalismExample() {
  return (
    <PageTransition type="fade">
      <ShimmerButton>Apply</ShimmerButton>
    </PageTransition>
  );
}
