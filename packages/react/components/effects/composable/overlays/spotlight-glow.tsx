import type { SpotlightGlowOverlay, OverlayContext } from "../../../../motion-types";

export function SpotlightGlowLayer({
  ctx, motionAllowed,
  glowColor = "var(--infini-color-primary)", glowIntensity = 0.6, glowRadius = 200,
}: SpotlightGlowOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  if (!motionAllowed) return null;

  const bg = ctx.hovered
    ? `radial-gradient(${glowRadius}px circle at ${ctx.mouseX}px ${ctx.mouseY}px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 100)}%, transparent), transparent 70%)`
    : "none";

  return (
    <>
      <span aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit", background: bg,
        pointerEvents: "none", opacity: ctx.hovered ? 1 : 0, transition: "opacity 0.3s ease", zIndex: 0,
      }} />
      <span aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        boxShadow: ctx.hovered ? `inset 0 0 0 1px color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 50)}%, transparent)` : "none",
        transition: "box-shadow 0.3s ease", zIndex: 1,
      }} />
    </>
  );
}
