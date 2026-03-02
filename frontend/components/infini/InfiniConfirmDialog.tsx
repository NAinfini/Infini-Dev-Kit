import type { ConfirmDialogProps } from "../../theme/motion-types";
import { ConfirmDialog } from "../ConfirmDialog";
import { useThemeDefaults } from "./use-theme-defaults";
import { CONFIRM_DIALOG_DEFAULTS } from "./theme-defaults/confirm-dialog";

export function InfiniConfirmDialog(props: ConfirmDialogProps) {
  const resolved = useThemeDefaults(props, CONFIRM_DIALOG_DEFAULTS);
  return <ConfirmDialog {...resolved} />;
}
