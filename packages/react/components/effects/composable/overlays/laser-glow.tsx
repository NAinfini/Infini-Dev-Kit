import { useEffect, useRef, useState } from "react";

import type { LaserGlowOverlay, OverlayContext } from "../../../../motion-types";

export function LaserGlowLayer({
  ctx, fullMotion, motionAllowed,
  glowColor = "var(--infini-color-primary)", glowIntensity = 0.6, spinSpeed = 1.5,
}: LaserGlowOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!ctx.hovered || !fullMotion) { setRotation(0); return; }
    let angle = 0;
    const spin = () => {
      angle = (angle + spinSpeed) % 360;
      setRotation(angle);
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ctx.hovered, fullMotion, spinSpeed]);

  if (!motionAllowed || !fullMotion) return null;

  const pct = Math.round(glowIntensity * 100);
  const { mouseX: x, mouseY: y, hovered } = ctx;

  return (
    <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Rotating conic gradient */}
      <span aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        background: hovered
          ? `conic-gradient(from ${rotation}deg at ${x}px ${y}px, transparent 0deg, color-mix(in srgb, ${glowColor} ${pct}%, transparent) 60deg, transparent 120deg, color-mix(in srgb, ${glowColor} ${Math.round(pct * 0.6)}%, transparent) 240deg, transparent 360deg)`
          : "none",
        opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease",
      }} />
      {/* Crosshair lines */}
      {hovered && (
        <>
          <span aria-hidden style={{
            position: "absolute", left: x - 1, top: 0, width: 2, height: "100%", pointerEvents: "none",
            background: `linear-gradient(to bottom, transparent, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 45%, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 55%, transparent)`,
          }} />
          <span aria-hidden style={{
            position: "absolute", top: y - 1, left: 0, height: 2, width: "100%", pointerEvents: "none",
            background: `linear-gradient(to right, transparent, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 45%, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 55%, transparent)`,
          }} />
        </>
      )}
      {/* Border glow */}
      <span aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        boxShadow: hovered ? `inset 0 0 0 1px color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 50)}%, transparent)` : "none",
        transition: "box-shadow 0.3s ease",
      }} />
    </span>
  );
}
