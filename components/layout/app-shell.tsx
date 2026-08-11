"use client";

import { AppSidebar } from "./app-sidebar";
import { MobileNav } from "./mobile-nav";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { ConnectionIndicator } from "./connection-indicator";
import { useDerivSession } from "@/lib/deriv/session-context";

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { state, account } = useDerivSession();
  const connectionState =
    state === "open" ? "connected" : state === "connecting" ? "connecting" : state === "reconnecting" ? "reconnecting" : "disconnected";

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-ink/90 px-4 backdrop-blur lg:px-6">
          <h1 className="font-display text-lg font-semibold">{title}</h1>
          <div className="flex items-center gap-3">
            <ConnectionIndicator
              state={connectionState}
              accountType={account ? (account.isVirtual ? "demo" : "real") : undefined}
            />
            <ThemeSwitcher />
          </div>
        </header>
        <main className="flex-1 p-4 pb-20 lg:p-6 lg:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
