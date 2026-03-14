import SourceHanSansSC from "../fonts/SourceHanSansSC-Medium-2.otf";
import YouSheBiaoTiHei from "../fonts/YouSheBiaoTiHei-2.ttf";
import MaoKenZhuYuanTi from "../fonts/MaoKenZhuYuanTi-MaokenZhuyuanTi-2.ttf";
import YouSheYuFeiTeJianKangTi from "../fonts/YouSheYuFeiTeJianKangTi-2.ttf";
import SanJiXingKaiJianTi from "../fonts/SanJiXingKaiJianTi-Cu-2.ttf";
import MaoKenShiJinHei from "../fonts/MaoKenShiJinHei-2.ttf";

const faces = `
@font-face {
  font-family: 'Source Han Sans SC';
  src: url('${SourceHanSansSC}') format('opentype');
  font-display: swap;
}
@font-face {
  font-family: 'YouShe BiaoTiHei';
  src: url('${YouSheBiaoTiHei}') format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'MaoKen ZhuYuanTi';
  src: url('${MaoKenZhuYuanTi}') format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'YouShe YuFeiTe JianKangTi';
  src: url('${YouSheYuFeiTeJianKangTi}') format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'MaoKen ShiJinHei';
  src: url('${MaoKenShiJinHei}') format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'SanJi XingKai JianTi';
  src: url('${SanJiXingKaiJianTi}') format('truetype');
  font-display: swap;
}
`;

let initialized = false;
let styleElement: { remove?: () => void } | null = null;

export function initFonts(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;
  const style = document.createElement("style");
  style.textContent = faces;
  document.head.appendChild(style);
  styleElement = style;
}

export async function loadThemeFonts(_themeId: string): Promise<void> {
  initFonts();
}

export async function loadLocaleFonts(_locale: string, _themeId?: string): Promise<void> {
  initFonts();
}

export function preloadCommonFonts(): void {
  initFonts();
}

export function clearFontCache(): void {
  styleElement?.remove?.();
  styleElement = null;
  initialized = false;
}
