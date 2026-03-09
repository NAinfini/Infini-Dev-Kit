import { forwardRef } from "react";
import { SimpleGrid } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type InfiniResponsiveGridProps = {
  children: ReactNode;
  minChildWidth?: number;
  spacing?: number | string;
  className?: string;
  style?: CSSProperties;
};

export const InfiniResponsiveGrid = forwardRef<HTMLDivElement, InfiniResponsiveGridProps>(
  function InfiniResponsiveGrid({
    children,
    minChildWidth = 280,
    spacing = "md",
    className,
    style,
    ...rest
  }, ref) {
    return (
      <SimpleGrid
        ref={ref}
        cols={{ base: 1, xs: 2, sm: 3, md: 4 }}
        spacing={spacing}
        className={className}
        style={{
          "--grid-min-child-width": `${minChildWidth}px`,
          ...style,
        } as CSSProperties}
        {...rest}
      >
        {children}
      </SimpleGrid>
    );
  }
);
