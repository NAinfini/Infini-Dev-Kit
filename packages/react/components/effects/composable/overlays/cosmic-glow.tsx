import { useEffect, useRef, useState } from "react";

import type { CosmicGlowOverlay, OverlayContext } from "../../../../motion-types";

interface Particle { id: number; x: number; y: number; vx: number; vy: number; size: number; opacity: number; }
const MAX = 30;
const DECAY = 0.997;

export function CosmicGlowLayer({
  ctx, fullMotion, motionAllowed,
  glowColor = "var(--infini-color-primary)", glowIntensity = 0.6, glowRadius = 200,
}: CosmicGlowOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const pid = useRef(0);
  const raf = useRef<number>(0);
  const lastSpawn = useRef(0);
  const { mouseX: x, mouseY: y, hovered } = ctx;

  useEffect(() => {
    if (!hovered || !fullMotion) { setParticles([]); return; }
    const tick = (now: number) => {
      if (now - lastSpawn.current > 80 && particles.length < MAX) {
        lastSpawn.current = now;
        pid.current += 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.8;
        setParticles((prev) => [...prev.slice(-(MAX - 1)), {
          id: pid.current, x: x + (Math.random() - 0.5) * 20, y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 4, opacity: 0.5 + Math.random() * 0.5,
        }]);
      }
      setParticles((prev) => prev
        .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * DECAY, vy: p.vy * DECAY, opacity: p.opacity * 0.993 }))
        .filter((p) => p.opacity > 0.05));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [hovered, x, y, fullMotion]);

  if (!motionAllowed || !fullMotion) return null;

  const bg = hovered
    ? `radial-gradient(${glowRadius * 0.8}px circle at ${x}px ${y}px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 60)}%, transparent), transparent 70%)`
    : "none";

  return (
    <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <span aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit", background: bg,
        pointerEvents: "none", opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease",
      }} />
      {particles.map((p) => (
        <span key={p.id} aria-hidden style={{
          position: "absolute", left: p.x - p.size / 2, top: p.y - p.size / 2,
          width: p.size, height: p.size, borderRadius: "50%", background: glowColor,
          opacity: p.opacity * glowIntensity, boxShadow: `0 0 ${p.size * 2}px ${glowColor}`,
          pointerEvents: "none",
        }} />
      ))}
      <span aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        boxShadow: hovered ? `inset 0 0 0 1px color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 50)}%, transparent)` : "none",
        transition: "box-shadow 0.3s ease",
      }} />
    </span>
  );
}
