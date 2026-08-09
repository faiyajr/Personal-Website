import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

import { SiteBackground } from "@/components/background/site-background";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { OverflowProbe } from "@/components/dev/overflow-probe";
import { site } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Every tab reads exactly "Faiyaj Rahman". No template, so child pages
  // inherit this rather than appending their own name.
  title: site.name,
  description: site.intro,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.title}`,
    description: site.intro,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description: site.intro,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#232926" },
  ],
};

const forceMotion =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_FORCE_MOTION === "1";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrument.variable} ${jetbrains.variable}${
        // Development-only escape hatch so animations can be previewed on a
        // machine with OS reduced-motion switched on. Compiled out in
        // production, so it can never override a real preference.
        forceMotion ? " force-motion" : ""
      }`}
    >
      {/* Browser extensions (Grammarly, password managers, translators) inject
          attributes into <body> before React hydrates, which React reports as
          a mismatch. Nothing here can prevent that, and the warning is noise —
          suppression covers attributes on this element only, so a genuine
          mismatch inside the tree is still reported. */}
      <body suppressHydrationWarning className="grain min-h-dvh antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <SiteBackground />

          {/* Everything sits above the background field. */}
          <div className="relative z-10">
            <ScrollProgress />
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
          </div>

          {/* Temporary — remove with the component once the mobile overflow is
              traced. Renders nothing without `?debug=overflow`. */}
          <OverflowProbe />
        </ThemeProvider>
      </body>
    </html>
  );
}
