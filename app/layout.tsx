import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { DerivSessionProvider } from "@/lib/deriv/session-context";
import { getSiteConfig } from "@/config/site";
import "./globals.css";

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: `${site.brand.name} — Deriv Market Analysis & Signals`,
  description: site.brand.shortDescription,
  openGraph: {
    title: site.brand.name,
    description: site.brand.shortDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.brand.name,
    description: site.brand.shortDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body">
        <ThemeProvider>
          <DerivSessionProvider>{children}</DerivSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
