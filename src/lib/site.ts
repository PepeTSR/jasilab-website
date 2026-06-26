/** Site mode: jasilab.net (/cvt prefix) vs cvt.co.ug (root). Set at build time via PUBLIC_CVT_BASE. */

const rawBase = import.meta.env.PUBLIC_CVT_BASE;

/** '' on cvt.co.ug builds; '/cvt' on jasilab.net (default). */
export const cvtBase = rawBase === "" ? "" : (rawBase ?? "/cvt").replace(/\/$/, "");

export const isCvtRootSite = cvtBase === "";

/**
 * Path prefix for internal CVT links.
 * In dev, Astro still serves CVT under /cvt even when simulating cvt.co.ug (PUBLIC_CVT_BASE="").
 * Production build:cvt lifts dist/cvt → dist-cvt root, so links stay at /.
 */
export function getCvtHrefBase(): string {
  if (cvtBase !== "") return cvtBase;
  if (import.meta.env.DEV) return "/cvt";
  return "";
}

export const publicSiteUrl =
  import.meta.env.PUBLIC_SITE_URL ?? (isCvtRootSite ? "https://cvt.co.ug" : "https://jasilab.net");

export const jasilabUrl = "https://jasilab.net";
export const cvtMarketingUrl = "https://cvt.co.ug";
export const cvtContactEmail = "hello@jasilab.net";

/** Live CVT registry app */
export const cvtAppUrl = "https://cvt.ug";

/**
 * Public asset path under public/cvt/ — dev serves /cvt/*; packaged cvt.co.ug uses /.
 * package-cvt-site.mjs also rewrites src="/cvt/ in HTML.
 */
export function cvtPublicAsset(filename: string): string {
  const clean = filename.replace(/^\//, "");
  const base = getCvtHrefBase();
  return base ? `${base}/${clean}` : `/${clean}`;
}

/** Build an internal CVT path. Examples: cvtPath(), cvtPath('vision'), cvtPath('#how-it-works'). */
export function cvtPath(subpath = ""): string {
  const base = getCvtHrefBase();
  if (!subpath) return base ? `${base}/` : "/";
  if (subpath.startsWith("#")) return base ? `${base}/${subpath}` : `/${subpath}`;
  const clean = subpath.replace(/^\//, "").replace(/\/$/, "");
  const path = base ? `${base}/${clean}` : `/${clean}`;
  // cvt.co.ug uses trailingSlash: always — dev must match or routes 404
  return isCvtRootSite ? `${path}/` : path;
}

export function cvtHomeHref(): string {
  const base = getCvtHrefBase();
  return base ? `${base}/` : "/";
}

export function isActiveCvtNav(pathname: string, href: string, homeHref: string): boolean {
  const norm = (p: string) => p.replace(/\/$/, "") || "/";
  const path = norm(pathname);
  const home = norm(homeHref);
  const link = norm(href);
  const base = norm(getCvtHrefBase());

  if (link === home || link === base || href === "/") {
    return path === "/" || path === home || path === base || path === "/cvt";
  }
  return path === link || path.startsWith(`${link}/`);
}
