# DerivLens — foundation scaffold

This is the **architectural foundation** for the Deriv analysis/signals/trading
platform, not the finished product — that's a multi-week build. What's here is
real, typechecked, lints clean, and builds successfully (`npm run build`
verified in this environment; Google Fonts couldn't be reached from the
sandbox's restricted network, but will resolve normally on Vercel/Railway/any
host with open internet).

## What's actually built

- **Next.js 15.5 + TypeScript + Tailwind**, App Router.
- **Theme system**: dark / light / system via `next-themes`, applied through
  CSS custom properties (`app/globals.css`) so every surface — landing,
  dashboard, analyzer, cards, badges — reads both palettes correctly. No
  page is dark-only.
- **Configuration system** (`config/site.ts` + `.env.example`): brand name,
  logo, colors, support contacts, all ten social platforms, the Deriv
  affiliate URL, and the Deriv app ID/redirect URI are all read from env vars.
  Nothing is hardcoded or invented — an unset value is simply hidden from the
  UI (e.g. `SocialLinks` renders only configured platforms; the affiliate CTA
  only appears once `NEXT_PUBLIC_DERIV_AFFILIATE_URL` is set).
- **DigitCircle / DigitGrid** (`components/digit/`): built exactly to spec —
  each digit lives inside its own circular element, arranged 3/3/3/1 with 9
  centered alone, with a live "LIVE" pulse state, a frequency ring, hot/cold
  color, and a streak indicator below. This is the component every other
  digit-analysis feature will plug data into.
- **Design language**: near-black graphite base with a phosphor-green signal
  accent (terminal/oscilloscope feel, not a generic dashboard look), Space
  Grotesk for display type, Inter for body, JetBrains Mono for all numeric
  data (prices, digits, stats) — tabular figures throughout.
- **Landing page** (`app/page.tsx`): hero, digit-grid showcase (explicitly
  labeled illustrative, zero fabricated stats), features, supported
  contracts, how-it-works, risk disclosure, FAQ. No fake testimonials, user
  counts, or performance numbers, per your spec.
- **App shell**: sidebar nav (desktop) + bottom nav (mobile), connection
  indicator (demo/real, disconnected/connected/reconnecting states), theme
  switcher in the top bar.
- **Dashboard** and **Analyzer** pages: real empty states ("No Deriv account
  connected", "No ticks yet", "NO TRADE — no evidence to evaluate") instead
  of mocked numbers. The analyzer layout matches the spec's top/left/center/
  right/bottom structure with the digit grid wired into the center panel and
  a follow-live-tick toggle already functional (UI-only, no data source yet).

## What's not built yet (by design — needs real credentials/decisions first)

- Deriv WebSocket client, OAuth flow, active-symbol/contract discovery —
  needs your registered `DERIV_APP_ID` and current API docs verification
  before writing real integration code.
- Digit/volatility/signal computation engines, backtesting, Groq AI layer.
- Database schema + Supabase/Postgres wiring, RLS, auth, multi-tenant
  isolation.
- Risk engine, trade execution (paper/assisted/auto), subscriptions, admin.
- Remaining sidebar routes (`/markets`, `/strategies`, `/backtesting`, etc.)
  are linked but not yet scaffolded as pages.

## Setup

```bash
cp .env.example .env.local   # fill in your real values — see .env.example
npm install
npm run dev
```

Fill in `.env.local` as you get each credential:
- `DERIV_APP_ID` / `DERIV_OAUTH_CLIENT_ID` / `DERIV_OAUTH_CLIENT_SECRET` —
  from your Deriv app registration.
- `NEXT_PUBLIC_DERIV_AFFILIATE_URL` — your real affiliate link.
- `NEXT_PUBLIC_SOCIAL_*` — only the platforms you actually want shown.
- `GROQ_API_KEY` — once we build the AI analyst layer.
- `DATABASE_URL` / `SUPABASE_*` — once we build persistence.

## Suggested next session

Tell me which slice to build next — I'd suggest, in order: (1) Deriv
OAuth connect flow + WebSocket tick stream wired into the dashboard/analyzer,
(2) digit statistics engine feeding real data into `DigitGrid`, (3) the
volatility + signal engine, (4) Groq AI analyst panel, (5) DB schema + auth +
risk engine + backtesting. Each is its own focused build, same as
moneybagpro/TheraSpace/HRMS.
