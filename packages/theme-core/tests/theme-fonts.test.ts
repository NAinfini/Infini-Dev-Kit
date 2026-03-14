import { afterEach, describe, expect, it } from "vitest";

import { buildScopedCssVariables, clearFontCache, listThemeSpecs, loadThemeFonts } from "../index";

const BUNDLED_FONT_FAMILIES = [
  "Source Han Sans SC",
  "YouShe BiaoTiHei",
  "MaoKen ZhuYuanTi",
  "YouShe YuFeiTe JianKangTi",
  "MaoKen ShiJinHei",
  "SanJi XingKai JianTi",
] as const;

type FakeStyleElement = {
  textContent: string;
  remove: () => void;
};

type DocumentDescriptor = PropertyDescriptor | undefined;

function installFakeDocument() {
  const appended: FakeStyleElement[] = [];
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");

  const fakeDocument = {
    createElement() {
      const node: FakeStyleElement = {
        textContent: "",
        remove() {
          const index = appended.indexOf(node);
          if (index >= 0) {
            appended.splice(index, 1);
          }
        },
      };

      return node;
    },
    head: {
      appendChild(node: FakeStyleElement) {
        appended.push(node);
        return node;
      },
    },
  };

  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: fakeDocument,
    writable: true,
  });

  return { appended, previous };
}

function restoreDocument(previous: DocumentDescriptor) {
  if (previous) {
    Object.defineProperty(globalThis, "document", previous);
    return;
  }

  Reflect.deleteProperty(globalThis, "document");
}

afterEach(() => {
  clearFontCache();
});

describe("theme font contracts", () => {
  it("uses bundled font families for every shipped theme locale", () => {
    const themes = listThemeSpecs();

    for (const theme of themes) {
      const localeFonts = [
        theme.typography.en.body,
        theme.typography.en.heading,
        theme.typography.zh.body,
        theme.typography.zh.heading,
        theme.typography.ja.body,
        theme.typography.ja.heading,
      ];

      for (const fontStack of localeFonts) {
        expect(
          BUNDLED_FONT_FAMILIES.some((fontFamily) => fontStack.includes(fontFamily)),
          `${theme.id} should use a bundled font stack, got: ${fontStack}`,
        ).toBe(true);
      }
    }
  });

  it("keeps heading token aliases aligned with display tokens", () => {
    const vars = buildScopedCssVariables("red-gold", ".scope").variables;

    expect(vars["--infini-font-heading"]).toBe(vars["--infini-font-display"]);
    expect(vars["--infini-font-heading-zh"]).toBe(vars["--infini-font-display-zh"]);
    expect(vars["--infini-font-heading-ja"]).toBe(vars["--infini-font-display-ja"]);
  });

  it("injects bundled font faces when theme fonts are requested", async () => {
    const { appended, previous } = installFakeDocument();

    try {
      await loadThemeFonts("cyberpunk");

      expect(appended).toHaveLength(1);
      expect(appended[0].textContent).toContain("@font-face");
      expect(appended[0].textContent).toContain("YouShe BiaoTiHei");
    } finally {
      restoreDocument(previous);
    }
  });
});
