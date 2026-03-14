import { useEffect, useRef, useState } from "react";

import type { GlitchGlowOverlay, OverlayContext } from "../../../../motion-types";

export function GlitchGlowLayer({
  ctx, fullMotion, motionAllowed,
  glowColor = "var(--infini-color-primary)", glowIntensity = 0.6, glowRadius = 200,
}: GlitchGlowOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  const [scanOffset, setScanOffset] = useState(0);
  const [noiseOpacity, setNoiseOpacity] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!ctx.hovered || !fullMotion) { setScanOffset(0); setNoiseOpacity(0); return; }
    let offset = 0;
    const tick = () => {
      offset = (offset + 2.5) % 100;
      setScanOffset(offset);
      setNoiseOpacity(0.15 + Math.random() * 0.35);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [ctx.hovered, fullMotion]);

  if (!motionAllowed || !fullMotion) return null;

  const { mouseX: x, mouseY: y, hovered } = ctx;
  const pct = Math.round(glowIntensity * 15);
  const scanGrad = `repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, ${glowColor} ${pct}%, transparent) 2px, color-mix(in srgb, ${glowColor} ${pct}%, transparent) 4px)`;

  return (
    <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Base glow at cursor */}
      <span aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        background: hovered
          ? `radial-gradient(${glowRadius}px circle at ${x}px ${y}px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 80)}%, transparent), transparent 70%)`
          : "none",
        opacity: hovered ? noiseOpacity * 2 : 0, transition: "opacity 0.1s ease",
      }} />
      {/* Scanlines */}
      {hovered && (
        <span aria-hidden style={{
          position: "absolute", inset: 0, borderRadius: "inherit", background: scanGrad,
          backgroundPosition: `0 ${scanOffset}%`, pointerEvents: "none", opacity: noiseOpacity,
        }} />
      )}
      {/* Glitch bar */}
      {hovered && (
        <span aria-hidden style={{
          position: "absolute", left: 0, right: 0, top: `${scanOffset}%`,
          height: 3 + Math.random() * 5,
          background: `color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 50)}%, transparent)`,
          transform: `translateX(${(Math.random() - 0.5) * 8}px)`,
          pointerEvents: "none",
        }} />
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
