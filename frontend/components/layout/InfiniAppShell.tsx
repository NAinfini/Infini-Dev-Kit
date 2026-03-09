import { forwardRef } from "react";
import { AppShell, Burger, Group, NavLink, ScrollArea, Stack } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import type { CSSProperties, ReactNode } from "react";

export type NavItem = {
  icon?: ReactNode;
  label: string;
  to?: string;
  badge?: ReactNode;
  visible?: boolean;
  onClick?: () => void;
  active?: boolean;
};

export type InfiniAppShellProps = {
  navbar?: {
    items: NavItem[];
    collapsed?: boolean;
    onToggle?: (collapsed: boolean) => void;
    width?: number;
  };
  header?: {
    left?: ReactNode;
    right?: ReactNode;
    height?: number;
  };
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const InfiniAppShell = forwardRef<HTMLDivElement, InfiniAppShellProps>(
  function InfiniAppShell({
    navbar,
    header,
    footer,
    children,
    className,
    style,
    ...rest
  }, ref) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
    const isMobile = useMediaQuery("(max-width: 767px)") ?? false;
    const navWidth = navbar?.width ?? 260;
    const headerHeight = header?.height ?? 56;
    const navCollapsed = navbar?.collapsed ?? false;

    const visibleItems = navbar?.items.filter((item) => item.visible !== false) ?? [];

    return (
      <AppShell
        ref={ref}
        header={{ height: headerHeight }}
        navbar={navbar ? {
          width: navCollapsed ? 0 : navWidth,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: navCollapsed },
        } : undefined}
        footer={footer && isMobile ? { height: 56 } : undefined}
        padding="md"
        className={className}
        style={style}
        {...rest}
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="sm">
              {navbar ? (
                <Burger
                  opened={isMobile ? mobileOpened : !navCollapsed}
                  onClick={() => {
                    if (isMobile) {
                      toggleMobile();
                    } else {
                      navbar.onToggle?.(!navCollapsed);
                    }
                  }}
                  size="sm"
                />
              ) : null}
              {header?.left}
            </Group>
            {header?.right}
          </Group>
        </AppShell.Header>

        {navbar ? (
          <AppShell.Navbar>
            <ScrollArea style={{ flex: 1 }}>
              <Stack gap={2} p="xs">
                {visibleItems.map((item, index) => (
                  <NavLink
                    key={index}
                    label={item.label}
                    leftSection={item.icon}
                    rightSection={item.badge}
                    active={item.active}
                    onClick={() => {
                      item.onClick?.();
                      if (isMobile) toggleMobile();
                    }}
                  />
                ))}
              </Stack>
            </ScrollArea>
          </AppShell.Navbar>
        ) : null}

        <AppShell.Main>{children}</AppShell.Main>

        {footer && isMobile ? (
          <AppShell.Footer>{footer}</AppShell.Footer>
        ) : null}
      </AppShell>
    );
  }
);
