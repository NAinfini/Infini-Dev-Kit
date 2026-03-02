import type { ConfirmDialogProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const CONFIRM_DIALOG_DEFAULTS: ThemeDefaultsMap<ConfirmDialogProps> = {
  _base: { blur: true, confirmVariant: "danger", entranceStyle: "scale", overlayOpacity: 0.5 },
  chibi: { entranceStyle: "drop", overlayOpacity: 0.4 },
  cyberpunk: { entranceStyle: "slide-up", overlayOpacity: 0.7, blur: true },
  "neu-brutalism": { blur: false, entranceStyle: "fade", overlayOpacity: 0.3 },
  "black-gold": { entranceStyle: "scale", overlayOpacity: 0.6 },
  "red-gold": { entranceStyle: "scale", overlayOpacity: 0.6 },
};
