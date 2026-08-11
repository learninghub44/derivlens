import { NextResponse } from "next/server";

const TOKEN_ENDPOINT = "https://auth.deriv.com/oauth2/token";

export async function POST(req: Request) {
  const clientId = process.env.DERIV_OAUTH_CLIENT_ID || process.env.NEXT_PUBLIC_DERIV_APP_ID;
  const clientSecret = process.env.DERIV_OAUTH_CLIENT_SECRET; // optional — Deriv's flow is PKCE/public-client

  if (!clientId) {
    return NextResponse.json(
      { error: "DERIV_OAUTH_CLIENT_ID (or NEXT_PUBLIC_DERIV_APP_ID) is not configured." },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const { code, codeVerifier, redirectUri } = body ?? {};
  if (!code || !codeVerifier || !redirectUri) {
    return NextResponse.json({ error: "Missing code, codeVerifier or redirectUri." }, { status: 400 });
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  });
  if (clientSecret) params.set("client_secret", clientSecret);

  let upstream: Response;
  try {
    upstream = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach Deriv's token endpoint." }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok || !data?.access_token) {
    return NextResponse.json(
      { error: data?.error_description || data?.error || "Deriv rejected the token exchange." },
      { status: upstream.status || 502 },
    );
  }

  // We only mark a lightweight, non-sensitive "connected" flag as an
  // httpOnly cookie for server components; the access_token itself is
  // returned once to the client, which is expected for Deriv apps since
  // the trading WebSocket connection is made directly from the browser.
  const res = NextResponse.json({ access_token: data.access_token, expires_in: data.expires_in });
  res.cookies.set("deriv_connected", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: data.expires_in ?? 3600,
    path: "/",
  });
  return res;
}
