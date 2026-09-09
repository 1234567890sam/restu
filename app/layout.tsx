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
    default: "MenuCraft — Digital Menu for Restaurants",
    template: "%s | MenuCraft",
  },
  description:
    "Create beautiful digital menus for your restaurant. QR code powered, mobile-friendly, instantly updatable. No app needed for customers.",
  keywords: [
    "digital menu",
    "restaurant menu",
    "QR code menu",
    "restaurant SaaS",
    "food menu",
    "online menu",
  ],
  authors: [{ name: "MenuCraft" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "MenuCraft",
    title: "MenuCraft — Digital Menu for Restaurants",
    description:
      "Create beautiful digital menus for your restaurant. QR code powered, mobile-friendly, instantly updatable.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuCraft — Digital Menu for Restaurants",
    description:
      "Create beautiful digital menus for your restaurant. QR code powered, mobile-friendly, instantly updatable.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
