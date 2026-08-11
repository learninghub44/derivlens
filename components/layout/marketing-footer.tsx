import Link from "next/link";
import { SocialLinks } from "./social-links";
import { getSiteConfig } from "@/config/site";

export function MarketingFooter() {
  const site = getSiteConfig();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-base font-semibold">{site.brand.name}</div>
            <p className="mt-2 max-w-xs text-sm text-text-muted">{site.brand.shortDescription}</p>
            {Object.keys(site.social).length > 0 && (
              <SocialLinks social={site.social} className="mt-4" />
            )}
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Product
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#features" className="text-text-muted hover:text-text-primary">Features</a></li>
              <li><a href="#strategies" className="text-text-muted hover:text-text-primary">Strategies</a></li>
              <li><a href="#pricing" className="text-text-muted hover:text-text-primary">Pricing</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Legal
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/legal/terms" className="text-text-muted hover:text-text-primary">Terms</Link></li>
              <li><Link href="/legal/privacy" className="text-text-muted hover:text-text-primary">Privacy</Link></li>
              <li><Link href="/legal/risk-disclosure" className="text-text-muted hover:text-text-primary">Risk Disclosure</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Deriv
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {site.affiliate.derivAffiliateUrl ? (
                <li>
                  <a
                    href={site.affiliate.derivAffiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal hover:underline"
                  >
                    Open a Deriv Account
                  </a>
                </li>
              ) : null}
              <li className="text-text-muted">This platform is independent of Deriv.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.brand.name}. All rights reserved.</p>
          <p className="max-w-2xl">
            Trading derivatives carries a high level of risk and may not be suitable for all
            investors. Past performance and statistical analysis do not guarantee future results.
            Nothing on this platform constitutes financial advice or a guarantee of profit.
          </p>
        </div>
      </div>
    </footer>
  );
}
