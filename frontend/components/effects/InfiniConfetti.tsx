import { forwardRef, useEffect, useRef, type CSSProperties } from "react";
import { useMergedRef } from "@mantine/hooks";
import clsx from "clsx";

type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
};

const DEFAULT_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

export type InfiniConfettiProps = {
  active?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  className?: string;
  style?: CSSProperties;
};

export const InfiniConfetti = forwardRef<HTMLCanvasElement, InfiniConfettiProps>(
  function InfiniConfetti({
    active = false,
    duration = 3000,
    particleCount = 80,
    colors = DEFAULT_COLORS,
    className,
    style,
    ...rest
  }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mergedRef = useMergedRef(canvasRef, ref);
    const animRef = useRef<number>(0);

    useEffect(() => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const particles: ConfettiParticle[] = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      }));

      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of particles) {
          p.x += p.vx;
          p.vy += 0.08;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.opacity = Math.max(0, 1 - progress * 0.8);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }

        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      animRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animRef.current);
    }, [active, duration, particleCount, colors]);

    return (
      <canvas
        ref={mergedRef}
        className={clsx(className)}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
          ...style,
        }}
        {...rest}
      />
    );
  }
);
