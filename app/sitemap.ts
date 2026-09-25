import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://menurestu.vercel.app";

  // Static high-priority landing and registration routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamically index public restaurant menus
  let restaurantRoutes: MetadataRoute.Sitemap = [];
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("restaurants")
        .select("slug, updated_at")
        .eq("is_active", true)
        .limit(200);

      const restaurants = data as Array<{ slug: string; updated_at?: string | null }> | null;

      if (restaurants && restaurants.length > 0) {
        restaurantRoutes = restaurants.map((r) => ({
          url: `${baseUrl}/r/${r.slug}`,
          lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      }
    }
  } catch (err) {
    console.warn("Could not query restaurants for dynamic sitemap:", err);
  }

  return [...staticRoutes, ...restaurantRoutes];
}
