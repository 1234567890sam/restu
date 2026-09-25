import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicMenu } from "@/lib/public-menu";
import { PublicMenuClient } from "./_components/public-menu-client";
import { Clock, QrCode, ShieldOff } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ table?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicMenu(slug);

  if (!data) {
    return {
      title: "Menu Not Found | MenuQR",
      description: "The requested digital restaurant menu could not be found.",
    };
  }

  const { restaurant } = data;
  const title = `${restaurant.name} - Live Digital Food Menu | MenuQR`;
  const description =
    restaurant.tagline ||
    restaurant.description ||
    `Browse the live contactless digital food menu of ${restaurant.name}. View dishes, prices, and Indian veg/non-veg tags online.`;
  const pageUrl = `https://menurestu.vercel.app/r/${slug}`;
  const ogImages = restaurant.cover_image_url
    ? [restaurant.cover_image_url]
    : restaurant.logo_url
    ? [restaurant.logo_url]
    : ["/opengraph-image"];

  return {
    title,
    description,
    keywords: [
      restaurant.name,
      `${restaurant.name} menu`,
      `${restaurant.name} digital menu`,
      "digital restaurant menu",
      "contactless food menu",
      "QR code menu",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

export default async function PublicMenuPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { table } = await searchParams;

  const data = await getPublicMenu(slug);

  if (!data) {
    notFound();
  }

  // Friendly page for pending / suspended restaurants
  if (data.menuStatus === "suspended" || data.menuStatus === "archived") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center mx-auto">
            <ShieldOff className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {data.restaurant.name}
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              This restaurant's digital menu is currently unavailable.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-sm text-slate-400 space-y-2">
            <p>This could be because:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>The restaurant account is under review</li>
              <li>The subscription has lapsed</li>
              <li>The owner has temporarily paused the menu</li>
            </ul>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <QrCode className="w-3.5 h-3.5 text-amber-500" />
            <span>Powered by MenuQR SaaS</span>
          </div>
        </div>
      </div>
    );
  }

  // Pending restaurant — still show the menu (owner can preview their own menu)
  // The is_active check is admin-controlled; we still display the menu
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": data.restaurant.name,
    "description": data.restaurant.description || data.restaurant.tagline || `Menu for ${data.restaurant.name}`,
    "image": data.restaurant.cover_image_url || data.restaurant.logo_url || "https://menurestu.vercel.app/favicon.svg",
    "url": `https://menurestu.vercel.app/r/${slug}`,
    "hasMenu": `https://menurestu.vercel.app/r/${slug}`,
    "servesCuisine": "Indian, Multi-Cuisine",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <PublicMenuClient
        restaurant={data.restaurant}
        categories={data.categories}
        tableNumber={table || null}
      />
    </>
  );
}
