import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, StatCard } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlugZap } from "lucide-react";

export default function DashboardPage() {
  // No Deriv account is wired up yet in this scaffold — every figure
  // below is a genuine empty state, not a placeholder number.
  const connected = false;

  return (
    <AppShell title="Dashboard">
      {!connected ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <PlugZap className="text-text-muted" size={28} />
          <div className="text-base font-semibold">No Deriv account connected</div>
          <p className="max-w-sm text-sm text-text-muted">
            Connect your Deriv account to start live analysis. Balance, open contracts and
            today&apos;s performance will appear here once you do.
          </p>
          <Link href="/connect" className={cn(buttonVariants(), "mt-2")}>
            Connect Deriv
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Balance" value="—" />
          <StatCard label="Market" value="—" />
          <StatCard label="Current digit" value="—" />
          <StatCard label="Signal status" value="—" />
        </div>
      )}
    </AppShell>
  );
}
