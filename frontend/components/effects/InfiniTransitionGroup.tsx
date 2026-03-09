import { Transition } from "@mantine/core";
import type { MantineTransition } from "@mantine/core";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";

export type TransitionItem = {
  key: string;
  mounted: boolean;
  children: ReactNode;
};

export type InfiniTransitionGroupProps = {
  items: TransitionItem[];
  transition?: MantineTransition;
  duration?: number;
  staggerDelay?: number;
  className?: string;
  style?: CSSProperties;
};

export const InfiniTransitionGroup = forwardRef<HTMLDivElement, InfiniTransitionGroupProps>(
  function InfiniTransitionGroup({
    items,
    transition = "fade",
    duration = 300,
    staggerDelay = 50,
    className,
    style,
    ...rest
  }, ref) {
    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        {items.map((item, index) => (
          <Transition
            key={item.key}
            mounted={item.mounted}
            transition={transition}
            duration={duration}
            timingFunction="ease"
            enterDelay={index * staggerDelay}
          >
            {(transitionStyles) => (
              <div style={transitionStyles}>{item.children}</div>
            )}
          </Transition>
        ))}
      </div>
    );
  }
);
