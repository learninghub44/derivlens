"use client";

import * as React from "react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateRandomString, generateCodeChallenge, PKCE_STORAGE_KEYS } from "@/lib/deriv/pkce";
import { PlugZap, AlertTriangle } from "lucide-react";

const AUTH_ENDPOINT = "https://auth.deriv.com/oauth2/auth";

export default function ConnectPage() {
  const [busy, setBusy] = React.useState(false);
  const appId = process.env.NEXT_PUBLIC_DERIV_APP_ID;
  const redirectUri =
    process.env.NEXT_PUBLIC_DERIV_REDIRECT_URI ||
    (typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "");

  async function startOAuth() {
    setBusy(true);
    const verifier = generateRandomString(48);
    const state = generateRandomString(16);
    const challenge = await generateCodeChallenge(verifier);

    sessionStorage.setItem(PKCE_STORAGE_KEYS.verifier, verifier);
    sessionStorage.setItem(PKCE_STORAGE_KEYS.state, state);

    const url = new URL(AUTH_ENDPOINT);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", appId!);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", "read trade admin");
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");

    window.location.href = url.toString();
  }

  return (
    <>
      <MarketingNav />
      <main className="mx-auto max-w-md px-4 py-20">
        <Card className="p-8 text-center">
          <PlugZap className="mx-auto text-signal" size={28} />
          <h1 className="mt-4 font-display text-xl font-semibold">Connect your Deriv account</h1>
          <p className="mt-2 text-sm text-text-muted">
            You&apos;ll be taken to Deriv&apos;s own sign-in page. This platform never sees your
            password.
          </p>

          {!appId ? (
            <div className="mt-6 flex items-start gap-2 rounded-md border border-amber/30 bg-amber/10 p-3 text-left text-sm text-amber">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                No Deriv app is configured yet. Set <code>NEXT_PUBLIC_DERIV_APP_ID</code> (and
                register the redirect URI) before this can connect.
              </span>
            </div>
          ) : (
            <Button className="mt-6 w-full" size="lg" onClick={startOAuth} disabled={busy}>
              {busy ? "Redirecting…" : "Continue to Deriv"}
            </Button>
          )}
        </Card>
      </main>
    </>
  );
}
