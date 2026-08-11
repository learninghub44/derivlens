import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { DigitGrid, type DigitStat } from "@/components/digit/digit-grid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getSiteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  Activity,
  LineChart,
  Gauge,
  Bot,
  FlaskConical,
  ShieldCheck,
  TestTube2,
  Bolt,
} from "lucide-react";

// Illustrative only — not live data. Used solely to demonstrate the
// digit-circle UI on the marketing page before a market is connected.
const PREVIEW_STATS: DigitStat[] = Array.from({ length: 10 }, (_, digit) => ({
  digit,
  frequency: 10,
  count: 0,
  streak: 0,
  isHot: false,
  isCold: false,
}));

const FEATURES = [
  { icon: Activity, title: "Live Market Data", desc: "Streamed tick and candle data straight from your connected Deriv account." },
  { icon: Gauge, title: "Digit Analysis", desc: "Frequency, streaks and multi-window statistics for every digit, updated tick by tick." },
  { icon: LineChart, title: "Contract Analysis", desc: "Over/Under, Even/Odd, Matches/Differs, Rise/Fall, Touch/No Touch and Accumulators, each with break-even and expected value shown plainly." },
  { icon: Bolt, title: "Configurable Volatility", desc: "Switch between tick volatility, ATR, standard deviation and more, over any window." },
  { icon: Bot, title: "AI Analyst", desc: "Groq-powered explanations built strictly from validated platform data — never a standalone signal source." },
  { icon: FlaskConical, title: "Strategy Builder & Backtesting", desc: "Compose strategies from statistical and price-based rules, then test them against history before risking anything." },
  { icon: TestTube2, title: "Paper Trading", desc: "Trade against live prices with zero real funds while you validate an approach." },
  { icon: ShieldCheck, title: "Risk Controls", desc: "Independent stake, loss and drawdown limits that AI cannot override." },
];

const CONTRACTS = [
  { name: "Over / Under", group: "Digits" },
  { name: "Even / Odd", group: "Digits" },
  { name: "Matches / Differs", group: "Digits" },
  { name: "Rise / Fall", group: "Direction" },
  { name: "Touch / No Touch", group: "Touch" },
  { name: "Accumulators", group: "Where supported" },
];

const STEPS = [
  { n: 1, title: "Connect", desc: "Link your Deriv account through Deriv's own OAuth flow. Your credentials never touch this platform." },
  { n: 2, title: "Select Market", desc: "Choose from the synthetic indices actually available on your account, pulled live from Deriv." },
  { n: 3, title: "Analyze", desc: "Read digit statistics, price structure and volatility side by side, synced to a single live cursor." },
  { n: 4, title: "Validate", desc: "Check the strategy score, expected value and the AI analyst's reasoning before doing anything." },
  { n: 5, title: "Trade", desc: "Go paper, assisted or — once you explicitly enable it — controlled automated trading." },
];

const FAQ = [
  { q: "Does this guarantee winning trades?", a: "No. Nothing on this platform guarantees a profit or a specific outcome. Every score is a strategy-quality measure, not a win probability." },
  { q: "Do I need the affiliate link to use this?", a: "No. You can connect any existing Deriv account. The affiliate link is only for people who don't have one yet and choose to open one through it." },
  { q: "Can the AI place trades on its own?", a: "No. The AI analyst explains evidence already computed by the platform. It cannot execute trades or override your risk settings." },
  { q: "What happens when there isn't a good setup?", a: "The signal engine returns NO TRADE and explains why — insufficient data, poor expected value, an unstable volatility regime, or a risk limit already reached." },
];

export default function LandingPage() {
  const site = getSiteConfig();

  return (
    <>
      <MarketingNav />
      <main>
        {/* HERO */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <Badge variant="signal">Deriv market analysis terminal</Badge>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Smarter analysis for Deriv trading
            </h1>
            <p className="mt-5 max-w-xl text-base text-text-muted sm:text-lg">
              Real-time market analysis, digit statistics, contract-specific breakdowns,
              configurable volatility tools and AI-assisted insight — for the Deriv markets
              you actually trade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                Start Analyzing
              </Link>
              <Link href="/connect" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
                Connect Deriv
              </Link>
              {site.affiliate.derivAffiliateUrl && (
                <a
                  href={site.affiliate.derivAffiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
                >
                  Open Deriv Account
                </a>
              )}
            </div>
          </div>
        </section>

        {/* DIGIT PREVIEW */}
        <section id="markets" className="border-b border-line bg-surface/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                  Every digit, its own circle, always
                </h2>
                <p className="mt-3 max-w-md text-text-muted">
                  Ten independent digit components track frequency, streaks and hot/cold
                  state live, synced to a cursor you can drag across tick history.
                </p>
              </div>
              <Card className="flex justify-center p-8">
                <DigitGrid stats={PREVIEW_STATS} activeDigit={null} />
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Built around what Deriv traders actually use
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <Card key={f.title} className="p-5">
                  <f.icon size={18} className="text-signal" />
                  <div className="mt-3 text-sm font-semibold">{f.title}</div>
                  <p className="mt-1.5 text-sm text-text-muted">{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPORTED CONTRACTS */}
        <section className="border-b border-line bg-surface/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Supported contracts</h2>
            <p className="mt-2 max-w-lg text-text-muted">
              Only the contract types below are exposed, and only when actually available
              for the selected market and account.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {CONTRACTS.map((c) => (
                <Badge key={c.name} variant="neutral" className="py-1.5">
                  {c.name} <span className="text-text-muted/60">· {c.group}</span>
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">How it works</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s) => (
                <li key={s.n}>
                  <div className="font-mono text-xs text-signal">0{s.n}</div>
                  <div className="mt-2 text-sm font-semibold">{s.title}</div>
                  <p className="mt-1.5 text-sm text-text-muted">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* RISK DISCLOSURE */}
        <section className="border-b border-line bg-surface/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Risk disclosure</h2>
            <p className="mt-3 max-w-2xl text-sm text-text-muted">
              Trading synthetic indices and other Deriv contracts involves a high level of
              risk and can result in the loss of your entire stake. Statistics, scores and
              AI commentary on this platform describe evidence quality, not the probability
              of a winning outcome. No feature on this platform, including automated
              trading, guarantees a profit. Trade only with funds you can afford to lose.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">FAQ</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <div className="text-sm font-semibold">{f.q}</div>
                  <p className="mt-1.5 text-sm text-text-muted">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
