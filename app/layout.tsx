import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/_components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MenuQR — Contactless Digital QR Menu for Restaurants",
    template: "%s | MenuQR SaaS",
  },
  description:
    "Launch your contactless QR digital menu in under 2 minutes. Dynamic prices, FSSAI Indian veg/non-veg tags, and instant table stands. Zero mobile app required for diners.",
  keywords: [
    "digital menu",
    "QR menu restaurant",
    "contactless dining menu",
    "restaurant SaaS India",
    "Solapur restaurant menu",
    "digital food menu",
    "touchless menu QR",
  ],
  authors: [{ name: "MenuQR SaaS" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "MenuQR SaaS",
    title: "MenuQR — Contactless Digital QR Menu for Restaurants",
    description:
      "Launch your contactless QR digital menu in under 2 minutes. Instant table stand QR codes and live price updates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuQR — Contactless Digital QR Menu for Restaurants",
    description:
      "Launch your contactless QR digital menu in under 2 minutes. Instant table stand QR codes and live price updates.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
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
