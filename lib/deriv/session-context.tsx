"use client";

import * as React from "react";
import { DerivSocket, type SocketState } from "./socket";

const TOKEN_STORAGE_KEY = "deriv_access_token";

export interface DerivAccount {
  loginid: string;
  currency: string;
  isVirtual: boolean;
  balance?: number;
}

interface DerivSessionValue {
  state: SocketState;
  account: DerivAccount | null;
  socket: DerivSocket | null;
  error: string | null;
  connectWithToken: (token: string) => Promise<void>;
  disconnect: () => void;
}

const DerivSessionContext = React.createContext<DerivSessionValue | null>(null);

export function DerivSessionProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_DERIV_APP_ID;
  const socketRef = React.useRef<DerivSocket | null>(null);
  const [state, setState] = React.useState<SocketState>("idle");
  const [account, setAccount] = React.useState<DerivAccount | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const getSocket = React.useCallback(() => {
    if (!appId) return null;
    if (!socketRef.current) {
      const s = new DerivSocket(appId);
      s.onStateChange(setState);
      socketRef.current = s;
    }
    return socketRef.current;
  }, [appId]);

  const connectWithToken = React.useCallback(
    async (token: string) => {
      setError(null);
      const socket = getSocket();
      if (!socket) {
        setError("NEXT_PUBLIC_DERIV_APP_ID is not configured.");
        return;
      }
      try {
        await socket.connect();
        const res = await socket.authorize(token);
        const auth = res.authorize;
        if (auth) {
          setAccount({
            loginid: auth.loginid,
            currency: auth.currency,
            isVirtual: Boolean(auth.is_virtual),
            balance: auth.balance,
          });
          sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to authorize with Deriv.");
      }
    },
    [getSocket],
  );

  const disconnect = React.useCallback(() => {
    socketRef.current?.disconnect();
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setAccount(null);
  }, []);

  // Resume an existing session (same tab) without re-running the OAuth flow.
  React.useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) connectWithToken(stored);
    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: DerivSessionValue = {
    state,
    account,
    socket: socketRef.current,
    error,
    connectWithToken,
    disconnect,
  };

  return <DerivSessionContext.Provider value={value}>{children}</DerivSessionContext.Provider>;
}

export function useDerivSession() {
  const ctx = React.useContext(DerivSessionContext);
  if (!ctx) throw new Error("useDerivSession must be used within DerivSessionProvider");
  return ctx;
}
