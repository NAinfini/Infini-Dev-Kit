import { useCallback, type Ref, type RefCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

function assignRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") ref(value);
  else if (ref && "current" in ref) (ref as React.MutableRefObject<T>).current = value;
}

export function useMergedRef<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return useCallback((node: T) => { refs.forEach((r) => assignRef(r, node)); }, refs);
}
