import { isCvtRootSite } from "./site";

/** cvt.co.ug skin — set at build time: "" (default), "superhuman", or "tesla". */
export const cvtTheme = import.meta.env.PUBLIC_CVT_THEME ?? "";

export type CvtThemeId = "" | "superhuman" | "tesla";

export const isDefaultCvtTheme = isCvtRootSite && cvtTheme === "";
export const isSuperhumanTheme = isCvtRootSite && cvtTheme === "superhuman";
export const isTeslaTheme = isCvtRootSite && cvtTheme === "tesla";

/** Superhuman + Tesla — platform page, extended nav, Get verified CTA. */
export const isProductTheme = isSuperhumanTheme || isTeslaTheme;

export const cvtThemeLabel: Record<CvtThemeId | "default", string> = {
  default: "Default (dark product)",
  "": "Default (dark product)",
  superhuman: "Superhuman",
  tesla: "Tesla",
};

export function getActiveCvtTheme(): CvtThemeId | "default" {
  if (!isCvtRootSite) return "default";
  if (cvtTheme === "superhuman" || cvtTheme === "tesla") return cvtTheme;
  return "default";
}
