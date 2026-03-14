import { useMediaQuery } from "./use-media-query";

export type Breakpoint = "mobile" | "tablet" | "desktop";

const MOBILE_QUERY = "(max-width: 767px)";
const TABLET_QUERY = "(max-width: 1023px)";

export function useBreakpoint(): { isMobile: boolean; isTablet: boolean; breakpoint: Breakpoint } {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery(TABLET_QUERY);
  const breakpoint: Breakpoint = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  return { isMobile, isTablet, breakpoint };
}
