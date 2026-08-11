"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DigitGrid } from "@/components/digit/digit-grid";
import { useDerivSession } from "@/lib/deriv/session-context";
import { useDigitStats } from "@/lib/deriv/use-digit-stats";
import { cn } from "@/lib/utils";
import { Crosshair, Bot, ShieldAlert } from "lucide-react";

// The common Volatility Indices — always verify against `active_symbols`
// before shipping this list further; hardcoded here only as an initial
// picker until that call is wired in.
const MARKETS = [
  { symbol: "R_10", name: "Volatility 10 Index" },
  { symbol: "R_25", name: "Volatility 25 Index" },
  { symbol: "R_50", name: "Volatility 50 Index" },
  { symbol: "R_75", name: "Volatility 75 Index" },
  { symbol: "R_100", name: "Volatility 100 Index" },
];

export default function AnalyzerPage() {
  const { state, account } = useDerivSession();
  const connected = state === "open" && account !== null;
  const [symbol, setSymbol] = React.useState<string | null>(null);
  const [followLive, setFollowLive] = React.useState(true);

  const { stats, activeDigit, lastPrice, sampleSize } = useDigitStats(connected ? symbol : null);

  return (
    <AppShell title="Analyzer">
      <div className="grid gap-4 xl:grid-cols-[240px_1fr_320px]">
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-4 xl:order-1">
          <Card className="p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Market
            </div>
            {!connected ? (
              <p className="mt-3 text-sm text-text-muted">
                Connect your Deriv account to load available symbols.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-1">
                {MARKETS.map((m) => (
                  <button
                    key={m.symbol}
                    onClick={() => setSymbol(m.symbol)}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                      symbol === m.symbol
                        ? "bg-signal/12 font-medium text-signal"
                        : "text-text-muted hover:bg-surface-raised hover:text-text-primary",
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </Card>
          <Card className="p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Contract
            </div>
            <div className="mt-3 text-sm text-text-muted">
              {symbol
                ? "Digit contract analysis is shown below. Price-based contracts (Rise/Fall, Touch/No Touch) need the price engine — coming in the next slice."
                : "Select a market to see the contracts actually available for it."}
            </div>
          </Card>
        </div>

        {/* CENTER */}
        <div className="flex flex-col gap-4 xl:order-2">
          <Card className="flex h-64 items-center justify-center p-4 text-sm text-text-muted">
            {symbol && connected
              ? `Live price: ${lastPrice ?? "—"} — chart component not built yet, ticks are streaming.`
              : "Chart will appear once a market is connected and streaming."}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Digit distribution {sampleSize > 0 && `· ${sampleSize} ticks`}
              </div>
              <Button
                variant={followLive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFollowLive((v) => !v)}
              >
                <Crosshair size={14} />
                {followLive ? "Following live" : "Follow live tick"}
              </Button>
            </div>
            <div className="flex justify-center">
              <DigitGrid stats={stats} activeDigit={followLive ? activeDigit : null} />
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4 xl:order-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Signal
              </div>
              <Badge variant="neutral">NO TRADE</Badge>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              {sampleSize < 30
                ? "Insufficient data — the signal engine needs a larger sample before scoring any contract."
                : "The strategy/signal engine isn't wired in yet — this scaffold only streams and displays evidence so far."}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              <Bot size={13} /> AI analyst
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Connect a market to ask the AI analyst about current evidence, conflicts and
              why a signal is or isn&apos;t valid. (Groq layer not built yet.)
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              <ShieldAlert size={13} /> Risk check
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Risk controls are independent of the AI analyst and will block any proposal
              that violates your configured limits. (Risk engine not built yet.)
            </p>
          </Card>

          {!connected && (
            <Link href="/connect" className={cn(buttonVariants(), "w-full")}>
              Connect Deriv
            </Link>
          )}
        </div>
      </div>

      {/* BOTTOM */}
      <Card className="mt-4 p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
          Tick history
        </div>
        <div className="mt-3 text-sm text-text-muted">
          {sampleSize > 0
            ? `${sampleSize} ticks received for ${symbol}. A scrollable/virtualized table is the next UI pass.`
            : "No ticks yet."}
        </div>
      </Card>
    </AppShell>
  );
}
