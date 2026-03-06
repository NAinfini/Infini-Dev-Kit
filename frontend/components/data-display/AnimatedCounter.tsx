import { useMemo } from "react";

import { useAnimatedCounter } from "../../hooks/use-animated-counter";

export interface AnimatedCounterProps {
  target: number;
  className?: string;
  locale?: string;
}

export function AnimatedCounter({ target, className, locale = "en-US" }: AnimatedCounterProps) {
  const { ref, value } = useAnimatedCounter(target);
  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  return (
    <span ref={ref} className={className}>
      {formatter.format(value)}
    </span>
  );
}
