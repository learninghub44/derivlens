/**
 * PKCE (RFC 7636) helpers for Deriv's OAuth 2.0 Authorization Code flow.
 * Runs in the browser — Deriv's flow is a public client (no client_secret
 * required for the exchange), verified against developers.deriv.com/docs/intro/oauth/.
 */

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateRandomString(byteLength = 32): string {
  const arr = crypto.getRandomValues(new Uint8Array(byteLength));
  return base64UrlEncode(arr);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64UrlEncode(new Uint8Array(hash));
}

export const PKCE_STORAGE_KEYS = {
  verifier: "deriv_pkce_code_verifier",
  state: "deriv_pkce_state",
} as const;
