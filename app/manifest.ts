import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MenuQR — Contactless Digital QR Menu for Restaurants",
    short_name: "MenuQR",
    description:
      "Launch your contactless QR digital restaurant menu in 2 minutes. Instant table QR stand generator, live menu price updates, and Indian veg/non-veg tags.",
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
