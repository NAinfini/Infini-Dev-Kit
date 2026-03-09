import { forwardRef, useMemo } from "react";
import { useMergedRef } from "@mantine/hooks";
import clsx from "clsx";

import { useAnimatedCounter } from "../../hooks/use-animated-counter";

export interface AnimatedCounterProps {
  target: number;
  className?: string;
  locale?: string;
}

export const AnimatedCounter = forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  function AnimatedCounter({ target, className, locale = "en-US", ...rest }, ref) {
    const { ref: innerRef, value } = useAnimatedCounter(target);
    const mergedRef = useMergedRef(innerRef, ref);
    const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

    return (
      <span ref={mergedRef} className={clsx(className)} {...rest}>
        {formatter.format(value)}
      </span>
    );
  }
);
