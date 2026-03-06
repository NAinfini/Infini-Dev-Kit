import { useEffect, useRef } from "react";

import type { MatrixCodeRainProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";

const DEFAULT_CHARSET =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Canvas-based Matrix digital rain effect.
 * Inspired by nyxui's Matrix Code Rain.
 * Renders falling green (or themed) characters in columns,
 * each column moving at its own speed with random character changes.
 */
export function MatrixCodeRain({
  width = "100%",
  height = 300,
  color,
  fontSize = 14,
  charset = DEFAULT_CHARSET,
  speed = 1,
  density = 0.6,
  className,
}: MatrixCodeRainProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const effectiveColor = color ?? theme.palette.primary;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fullMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);

    // Wait a frame for sizing
    requestAnimationFrame(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const columns = Math.floor((canvas.width / fontSize) * density);
      const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -50);
      const speeds: number[] = new Array(columns).fill(0).map(() => 0.5 + Math.random() * 1.5);

      let lastTime = 0;
      const interval = Math.max(20, 50 / speed);

      const draw = (time: number) => {
        if (time - lastTime < interval) {
          animationRef.current = requestAnimationFrame(draw);
          return;
        }
        lastTime = time;

        // Fade effect
        ctx.fillStyle = `color-mix(in srgb, ${theme.foundation.background} 92%, transparent)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
          const char = charset[Math.floor(Math.random() * charset.length)];
          const x = (i / density) * fontSize;
          const y = drops[i] * fontSize;

          // Head character is brighter
          ctx.fillStyle = effectiveColor;
          ctx.globalAlpha = 1;
          ctx.fillText(char, x, y);

          // Trail character slightly dimmer
          if (drops[i] > 1) {
            ctx.globalAlpha = 0.5;
            const trailChar = charset[Math.floor(Math.random() * charset.length)];
            ctx.fillText(trailChar, x, y - fontSize);
          }

          ctx.globalAlpha = 1;

          drops[i] += speeds[i] * speed;

          // Reset column when it goes past screen
          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
            speeds[i] = 0.5 + Math.random() * 1.5;
          }
        }

        animationRef.current = requestAnimationFrame(draw);
      };

      animationRef.current = requestAnimationFrame(draw);
    });

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fullMotion, effectiveColor, fontSize, charset, speed, density, theme.foundation.background]);

  // Static fallback — just a dark background
  if (!fullMotion) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          background: theme.foundation.background,
          borderRadius: theme.foundation.radius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: effectiveColor,
          fontFamily: "monospace",
          fontSize,
          opacity: 0.4,
        }}
      >
        {">"} matrix
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width,
        height,
        display: "block",
        background: theme.foundation.background,
        borderRadius: theme.foundation.radius,
      }}
    />
  );
}
