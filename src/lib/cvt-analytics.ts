/** Marketing analytics (cvt.co.ug) - consent + PostHog. */

/** Same key as the Next.js public app cookie banner for shared preference on *.cvt.co.ug */
export const CVT_COOKIE_PREFERENCE_KEY = "ctv-cookie-preference";

export const CVT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function getPostHogKey(): string {
 return (import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined)?.trim() ?? "";
}

/** Default EU host; override with PUBLIC_POSTHOG_HOST if the project is US-hosted. */
export function getPostHogHost(): string {
 const host = (import.meta.env.PUBLIC_POSTHOG_HOST as string | undefined)?.trim();
 return host || "https://eu.i.posthog.com";
}

export function isPostHogConfigured(): boolean {
 return getPostHogKey().length > 0;
}
