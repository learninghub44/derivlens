"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DigitGrid, type DigitStat } from "@/components/digit/digit-grid";
import { Crosshair, Bot, ShieldAlert } from "lucide-react";

const EMPTY_STATS: DigitStat[] = Array.from({ length: 10 }, (_, digit) => ({
  digit,
  frequency: 0,
  count: 0,
  streak: 0,
  isHot: false,
  isCold: false,
}));

export default function AnalyzerPage() {
  const [followLive, setFollowLive] = React.useState(true);

  return (
    <AppShell title="Analyzer">
      <div className="grid gap-4 xl:grid-cols-[240px_1fr_320px]">
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-4 xl:order-1">
          <Card className="p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Market
            </div>
            <div className="mt-3 text-sm text-text-muted">
              No market selected. Connect your Deriv account to load available symbols.
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Contract
            </div>
            <div className="mt-3 text-sm text-text-muted">
              Select a market to see the contracts actually available for it.
            </div>
          </Card>
        </div>

        {/* CENTER */}
        <div className="flex flex-col gap-4 xl:order-2">
          <Card className="flex h-64 items-center justify-center p-4 text-sm text-text-muted">
            Chart will appear once a market is connected and streaming.
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Digit distribution
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
              <DigitGrid stats={EMPTY_STATS} activeDigit={null} />
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
              No market connected — there is no evidence to evaluate yet.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              <Bot size={13} /> AI analyst
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Connect a market to ask the AI analyst about current evidence, conflicts and
              why a signal is or isn&apos;t valid.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              <ShieldAlert size={13} /> Risk check
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Risk controls are independent of the AI analyst and will block any proposal
              that violates your configured limits.
            </p>
          </Card>
        </div>
      </div>

      {/* BOTTOM */}
      <Card className="mt-4 p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
          Tick history
        </div>
        <div className="mt-3 text-sm text-text-muted">No ticks yet.</div>
      </Card>
    </AppShell>
  );
}
