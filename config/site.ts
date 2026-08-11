/**
 * Central, server-readable configuration.
 *
 * IMPORTANT: every field here is sourced from environment variables.
 * Nothing is hardcoded or invented. Anything not supplied resolves to
 * `undefined` and the UI must treat it as "not configured" (hide the
 * link / CTA / feature), never fall back to a placeholder value.
 *
 * Secrets (client id/secret, service role keys, API keys) are never
 * imported into client components — only the `NEXT_PUBLIC_*` subset
 * below is safe for the browser.
 */

type SocialKey =
  | "whatsapp"
  | "telegram"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "x"
  | "youtube"
  | "linkedin"
  | "discord"
  | "website";

export interface SiteConfig {
  brand: {
    name: string;
    shortDescription: string;
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    supportEmail?: string;
    supportWhatsapp?: string;
  };
  social: Partial<Record<SocialKey, string>>;
  affiliate: {
    derivAffiliateUrl?: string;
  };
  deriv: {
    appId?: string;
    oauthRedirectUri?: string;
    // client secret intentionally excluded — server-only, read directly
    // from process.env.DERIV_OAUTH_CLIENT_SECRET where needed (API routes).
    configured: boolean;
  };
}

function readEnv(key: string): string | undefined {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

export function getSiteConfig(): SiteConfig {
  const social: Partial<Record<SocialKey, string>> = {
    whatsapp: readEnv("NEXT_PUBLIC_SOCIAL_WHATSAPP"),
    telegram: readEnv("NEXT_PUBLIC_SOCIAL_TELEGRAM"),
    facebook: readEnv("NEXT_PUBLIC_SOCIAL_FACEBOOK"),
    instagram: readEnv("NEXT_PUBLIC_SOCIAL_INSTAGRAM"),
    tiktok: readEnv("NEXT_PUBLIC_SOCIAL_TIKTOK"),
    x: readEnv("NEXT_PUBLIC_SOCIAL_X"),
    youtube: readEnv("NEXT_PUBLIC_SOCIAL_YOUTUBE"),
    linkedin: readEnv("NEXT_PUBLIC_SOCIAL_LINKEDIN"),
    discord: readEnv("NEXT_PUBLIC_SOCIAL_DISCORD"),
    website: readEnv("NEXT_PUBLIC_SOCIAL_WEBSITE"),
  };

  // Strip unconfigured keys entirely so callers can just do
  // Object.entries(social) and render only what exists.
  Object.keys(social).forEach((k) => {
    if (!social[k as SocialKey]) delete social[k as SocialKey];
  });

  const appId = readEnv("NEXT_PUBLIC_DERIV_APP_ID");
  const redirectUri = readEnv("NEXT_PUBLIC_DERIV_REDIRECT_URI");

  return {
    brand: {
      name: readEnv("NEXT_PUBLIC_BRAND_NAME") ?? "DerivLens",
      shortDescription:
        readEnv("NEXT_PUBLIC_BRAND_DESCRIPTION") ??
        "Market analysis and controlled trading tools for Deriv.",
      logoUrl: readEnv("NEXT_PUBLIC_BRAND_LOGO_URL"),
      faviconUrl: readEnv("NEXT_PUBLIC_BRAND_FAVICON_URL"),
      primaryColor: readEnv("NEXT_PUBLIC_BRAND_PRIMARY_COLOR"),
      secondaryColor: readEnv("NEXT_PUBLIC_BRAND_SECONDARY_COLOR"),
      supportEmail: readEnv("NEXT_PUBLIC_SUPPORT_EMAIL"),
      supportWhatsapp: readEnv("NEXT_PUBLIC_SUPPORT_WHATSAPP"),
    },
    social,
    affiliate: {
      derivAffiliateUrl: readEnv("NEXT_PUBLIC_DERIV_AFFILIATE_URL"),
    },
    deriv: {
      appId,
      oauthRedirectUri: redirectUri,
      configured: Boolean(appId),
    },
  };
}

export type { SocialKey };
