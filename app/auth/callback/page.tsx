"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PKCE_STORAGE_KEYS } from "@/lib/deriv/pkce";
import { useDerivSession } from "@/lib/deriv/session-context";
import { Loader2, AlertTriangle } from "lucide-react";

export default function AuthCallbackPage() {
  return (
    <React.Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4">
          <Loader2 className="animate-spin text-signal" size={24} />
        </main>
      }
    >
      <AuthCallbackInner />
    </React.Suspense>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { connectWithToken } = useDerivSession();
  const [error, setError] = React.useState<string | null>(null);
  const ran = React.useRef(false);

  React.useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function run() {
      const code = params.get("code");
      const state = params.get("state");
      const oauthError = params.get("error_description") || params.get("error");

      if (oauthError) {
        setError(oauthError);
        return;
      }
      const storedState = sessionStorage.getItem(PKCE_STORAGE_KEYS.state);
      const codeVerifier = sessionStorage.getItem(PKCE_STORAGE_KEYS.verifier);

      if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
        setError("This login link is invalid or expired. Please try connecting again.");
        return;
      }

      sessionStorage.removeItem(PKCE_STORAGE_KEYS.state);
      sessionStorage.removeItem(PKCE_STORAGE_KEYS.verifier);

      const redirectUri =
        process.env.NEXT_PUBLIC_DERIV_REDIRECT_URI || `${window.location.origin}/auth/callback`;

      const res = await fetch("/api/auth/deriv/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, codeVerifier, redirectUri }),
      });
      const data = await res.json();

      if (!res.ok || !data.access_token) {
        setError(data.error || "Deriv could not complete the connection.");
        return;
      }

      await connectWithToken(data.access_token);
      router.replace("/dashboard");
    }

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-sm p-8 text-center">
        {error ? (
          <>
            <AlertTriangle className="mx-auto text-danger" size={24} />
            <p className="mt-3 text-sm text-text-primary">{error}</p>
            <a href="/connect" className="mt-4 inline-block text-sm text-signal hover:underline">
              Try again
            </a>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto animate-spin text-signal" size={24} />
            <p className="mt-3 text-sm text-text-muted">Completing your Deriv connection…</p>
          </>
        )}
      </Card>
    </main>
  );
}
