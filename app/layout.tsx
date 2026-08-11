import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { DerivSessionProvider } from "@/lib/deriv/session-context";
import { getSiteConfig } from "@/config/site";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        <ThemeProvider>
          <DerivSessionProvider>{children}</DerivSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
