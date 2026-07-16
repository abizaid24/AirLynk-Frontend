import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ConciergeWidget } from "@/components/concierge/concierge-widget";
import { Toaster } from "@/components/ui/sonner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "AirLynk — Fly Beyond Distance",
    template: "%s · AirLynk",
  },
  description:
    "AirLynk is the next-generation AI-powered airline experience — search, book, and fly with an interactive 3D globe, an AI travel concierge, and a premium end-to-end journey.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "AirLynk — Fly Beyond Distance",
    description:
      "Search, book, and fly with an interactive 3D globe and an AI travel concierge.",
    siteName: "AirLynk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AirLynk — Fly Beyond Distance",
    description:
      "Search, book, and fly with an interactive 3D globe and an AI travel concierge.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#120d08" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SmoothScrollProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <ConciergeWidget />
            <Toaster position="top-center" richColors />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
