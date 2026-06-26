/** Site mode: jasilab.net (/cvt prefix) vs cvt.co.ug (root). Set at build time via PUBLIC_CVT_BASE. */

const rawBase = import.meta.env.PUBLIC_CVT_BASE;

/** '' on cvt.co.ug builds; '/cvt' on jasilab.net (default). */
export const cvtBase = rawBase === "" ? "" : (rawBase ?? "/cvt").replace(/\/$/, "");

export const isCvtRootSite = cvtBase === "";

export const publicSiteUrl =
  import.meta.env.PUBLIC_SITE_URL ?? (isCvtRootSite ? "https://cvt.co.ug" : "https://jasilab.net");

export const jasilabUrl = "https://jasilab.net";
export const cvtMarketingUrl = "https://cvt.co.ug";
export const cvtContactEmail = "hello@jasilab.net";

/** Build an internal CVT path. Examples: cvtPath(), cvtPath('vision'), cvtPath('#first-pilot'). */
export function cvtPath(subpath = ""): string {
  if (!subpath) return cvtBase ? `${cvtBase}/` : "/";
  if (subpath.startsWith("#")) return `${cvtBase || "/"}${subpath}`;
  const clean = subpath.replace(/^\//, "");
  return cvtBase ? `${cvtBase}/${clean}` : `/${clean}`;
}

export function cvtHomeHref(): string {
  return cvtBase ? `${cvtBase}/` : "/";
}

export function isActiveCvtNav(pathname: string, href: string, homeHref: string): boolean {
  if (href === homeHref || href === cvtBase || href === "/") {
    return pathname === "/" || pathname === homeHref || pathname === cvtBase;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
