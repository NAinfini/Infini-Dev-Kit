import { useMemo } from "react";

import type { SpringProfile } from "../theme/motion-types";
import { getSpringProfile } from "../theme/spring-profiles";
import { useThemeSnapshot } from "../provider/InfiniProvider";

export function useThemeSpring(): SpringProfile {
  const { state } = useThemeSnapshot();

  return useMemo(() => getSpringProfile(state.themeId), [state.themeId]);
}
