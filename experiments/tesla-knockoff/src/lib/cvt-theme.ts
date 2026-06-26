import { isCvtRootSite } from "./site";

/** Experimental Tesla-inspired skin — set PUBLIC_CVT_THEME=tesla on cvt.co.ug builds only. */
export const isTeslaTheme = isCvtRootSite && import.meta.env.PUBLIC_CVT_THEME === "tesla";
