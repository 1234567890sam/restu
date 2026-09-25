import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/_components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://menurestu.vercel.app"),
  title: {
    default: "MenuQR — Contactless Digital QR Menu for Restaurants",
    template: "%s | MenuQR SaaS",
  },
  description:
    "Launch your contactless QR digital menu in under 2 minutes. Dynamic price updates, FSSAI Indian veg/non-veg tags, and instant table stand QR generators. Zero mobile app required for diners.",
  keywords: [
    "digital menu",
    "QR menu restaurant",
    "contactless dining menu",
    "restaurant SaaS India",
    "digital menu card for restaurants",
    "best qr menu software",
    "free qr code menu maker",
    "touchless menu QR",
    "Indian veg non veg food menu",
    "hotel table stand qr code",
    "digital restaurant menu Solapur",
    "smart contactless menu",
    "online food menu creator",
    "fssai restaurant menu",
    "cafe qr menu system",
  ],
  authors: [{ name: "MenuQR SaaS Team", url: "https://menurestu.vercel.app" }],
  creator: "MenuQR SaaS",
  publisher: "MenuQR SaaS",
  applicationName: "MenuQR",
  category: "Restaurant Technology & Business SaaS",
  alternates: {
    canonical: "https://menurestu.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://menurestu.vercel.app",
    siteName: "MenuQR SaaS",
    title: "MenuQR — Contactless Digital QR Menu for Restaurants",
    description:
      "Launch your contactless QR digital menu in under 2 minutes. Instant table stand QR codes and live price updates.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MenuQR — Contactless Digital QR Menu for Restaurants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuQR — Contactless Digital QR Menu for Restaurants",
    description:
      "Launch your contactless QR digital menu in under 2 minutes. Instant table stand QR codes and live price updates.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "7LfJSBrS7JZE1sTsZZpQFzH8LVp9K312T85YJJSZbcw",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
