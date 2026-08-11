"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Gauge,
  FlaskConical,
  TestTube2,
  Bot,
  Bolt,
  History,
  BarChart3,
  ShieldCheck,
  Star,
  Bell,
  Settings,
  UserCircle,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSiteConfig } from "@/config/site";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: LineChart },
  { href: "/analyzer", label: "Analyzer", icon: Gauge },
  { href: "/digit-analysis", label: "Digit Analysis", icon: Gauge },
  { href: "/strategies", label: "Strategies", icon: FlaskConical },
  { href: "/backtesting", label: "Backtesting", icon: TestTube2 },
  { href: "/ai-analyst", label: "AI Analyst", icon: Bot },
  { href: "/paper-trading", label: "Paper Trading", icon: TestTube2 },
  { href: "/auto-trading", label: "Auto Trading", icon: Bolt },
  { href: "/trade-history", label: "Trade History", icon: History },
  { href: "/performance", label: "Performance", icon: BarChart3 },
  { href: "/risk-controls", label: "Risk Controls", icon: ShieldCheck },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/account", label: "Account", icon: UserCircle },
];

export function AppSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const site = getSiteConfig();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link href="/" className="font-display text-base font-semibold">
          {site.brand.name}
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="App navigation">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-signal/12 font-medium text-signal"
                  : "text-text-muted hover:bg-surface-raised hover:text-text-primary",
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              pathname?.startsWith("/admin")
                ? "bg-amber/12 font-medium text-amber"
                : "text-text-muted hover:bg-surface-raised hover:text-text-primary",
            )}
          >
            <ShieldAlert size={16} />
            Admin
          </Link>
        )}
      </nav>
    </aside>
  );
}
