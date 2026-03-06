import { useCallback, useEffect, useRef } from "react";

import type { ParticleEffectProps, ParticlePreset } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "circle" | "square" | "triangle";
}

const PRESET_CONFIG: Record<ParticlePreset, {
  gravity: number;
  velocityRange: [number, number];
  sizeRange: [number, number];
  shapes: Particle["shape"][];
  opacityDecay: number;
  spread: number;
}> = {
  confetti: { gravity: 0.12, velocityRange: [3, 8], sizeRange: [5, 10], shapes: ["square", "circle"], opacityDecay: 0.995, spread: 1 },
  sparkle: { gravity: -0.02, velocityRange: [0.5, 2], sizeRange: [2, 5], shapes: ["circle"], opacityDecay: 0.98, spread: 1 },
  rain: { gravity: 0.3, velocityRange: [1, 3], sizeRange: [2, 3], shapes: ["circle"], opacityDecay: 0.998, spread: 0.3 },
  snow: { gravity: 0.03, velocityRange: [0.3, 1], sizeRange: [3, 7], shapes: ["circle"], opacityDecay: 0.997, spread: 1 },
  firework: { gravity: 0.08, velocityRange: [4, 10], sizeRange: [2, 4], shapes: ["circle"], opacityDecay: 0.985, spread: 1 },
};

let particleId = 0;

/**
 * Event-triggered particle effect system.
 * Supports presets: confetti, sparkle, rain, snow, firework.
 * Theme-aware colors and motion-gated.
 */
export function ParticleEffect({
  preset = "confetti",
  count = 30,
  colors,
  duration = 2,
  trigger = false,
  loop = false,
  gravity = 1,
  origin = { x: 0.5, y: 0.5 },
  className,
}: ParticleEffectProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const prevTrigger = useRef(false);

  const effectiveColors = colors ?? [
    theme.palette.primary,
    theme.palette.accent,
    theme.palette.success,
    theme.palette.warning,
    theme.palette.danger,
  ];

  const config = PRESET_CONFIG[preset];

  const spawnBurst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width * origin.x;
    const cy = canvas.height * origin.y;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = config.velocityRange[0] + Math.random() * (config.velocityRange[1] - config.velocityRange[0]);
      const spreadFactor = config.spread;
      particleId += 1;

      newParticles.push({
        id: particleId,
        x: cx + (Math.random() - 0.5) * 10,
        y: cy + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed * spreadFactor,
        vy: Math.sin(angle) * speed * (preset === "rain" || preset === "snow" ? 0.1 : 1) - (preset === "firework" ? speed * 0.6 : 0),
        size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
        color: effectiveColors[i % effectiveColors.length],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: config.shapes[Math.floor(Math.random() * config.shapes.length)],
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, [count, config, effectiveColors, origin, preset]);

  // Trigger detection
  useEffect(() => {
    if (!motionAllowed) return;

    if (trigger && !prevTrigger.current) {
      spawnBurst();
    }
    prevTrigger.current = trigger;
  }, [trigger, motionAllowed, spawnBurst]);

  // Loop
  useEffect(() => {
    if (!loop || !motionAllowed) return;
    const intervalMs = duration * 1000;
    spawnBurst();
    const id = window.setInterval(spawnBurst, intervalMs);
    return () => window.clearInterval(id);
  }, [loop, duration, motionAllowed, spawnBurst]);

  // Animation loop
  useEffect(() => {
    if (!motionAllowed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const effectiveGravity = config.gravity * gravity;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + effectiveGravity,
          vx: p.vx * 0.99,
          rotation: p.rotation + p.rotationSpeed,
          opacity: p.opacity * config.opacityDecay,
        }))
        .filter((p) => p.opacity > 0.01 && p.y < canvas.height + 20);

      for (const p of particlesRef.current) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [motionAllowed, config, gravity]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  if (!motionAllowed) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
