import { createAdminClient } from "@/lib/supabase/admin";
import type { Restaurant, Category, MenuItem } from "@/lib/database.types";
import { DEMO_RESTAURANT, DEMO_CATEGORIES, DEMO_ITEMS } from "./demo-data";

export interface PublicMenuData {
  restaurant: Restaurant;
  categories: (Category & {
    items: MenuItem[];
  })[];
  /** "active" = live, "pending" = awaiting admin approval, "suspended" = blocked */
  menuStatus: "active" | "pending" | "suspended" | "archived";
}

export async function getPublicMenu(slug: string): Promise<PublicMenuData | null> {
  const isDummyUrl =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

  if (isDummyUrl) {
    const categoriesWithItems = DEMO_CATEGORIES.map((cat) => ({
      ...cat,
      items: DEMO_ITEMS.filter((item) => item.category_id === cat.id),
    }));

    return {
      restaurant: {
        ...DEMO_RESTAURANT,
        slug: slug || DEMO_RESTAURANT.slug,
      },
      categories: categoriesWithItems,
      menuStatus: "active",
    };
  }

  try {
    const admin = createAdminClient();

    // 1. Fetch Restaurant by Slug
    const { data: rawRestaurant, error: restError } = await (admin as any)
      .from("restaurants")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (restError || !rawRestaurant) {
      // Fallback to demo if slug matches demo
      if (slug === "hotel-panchratna" || slug === "demo") {
        const categoriesWithItems = DEMO_CATEGORIES.map((cat) => ({
          ...cat,
          items: DEMO_ITEMS.filter((item) => item.category_id === cat.id),
        }));
        return { restaurant: DEMO_RESTAURANT, categories: categoriesWithItems, menuStatus: "active" };
      }
      return null;
    }

    const restaurant = rawRestaurant as unknown as Restaurant;

    // 2. Fetch Categories
    const { data: rawCategories, error: catError } = await (admin as any)
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurant.id);

    if (catError) {
      console.error("Error fetching categories:", catError);
      return null;
    }

    // Sort categories by display_order
    const sortedCategories = (rawCategories || []).sort((a: any, b: any) => {
      const orderA = a.display_order ?? a.sort_order ?? 0;
      const orderB = b.display_order ?? b.sort_order ?? 0;
      return orderA - orderB;
    });

    const activeCategories: Category[] = sortedCategories
      .filter((c: any) => c.is_visible !== false && c.is_active !== false)
      .map((c: any) => ({
        ...c,
        sort_order: c.display_order ?? c.sort_order ?? 0,
        display_order: c.display_order ?? c.sort_order ?? 0,
        is_active: c.is_visible ?? true,
        is_visible: c.is_visible ?? true,
        icon: c.icon || "Utensils",
      }));

    // 3. Fetch Active Menu Items
    const { data: rawItems, error: itemError } = await (admin as any)
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant.id);

    if (itemError) {
      console.error("Error fetching items:", itemError);
      return null;
    }

    const sortedItems = (rawItems || []).sort((a: any, b: any) => {
      const orderA = a.display_order ?? a.sort_order ?? 0;
      const orderB = b.display_order ?? b.sort_order ?? 0;
      return orderA - orderB;
    });

    const items: MenuItem[] = sortedItems
      .filter((i: any) => i.is_available !== false)
      .map((item: any) => ({
        ...item,
        food_type: item.food_type || (item.is_veg ? "veg" : "non-veg"),
        is_veg: item.is_veg ?? true,
        is_spicy: item.is_spicy ?? false,
        is_bestseller: item.is_bestseller ?? false,
        sort_order: item.display_order ?? item.sort_order ?? 0,
        display_order: item.display_order ?? item.sort_order ?? 0,
        badge: item.badge || (item.is_bestseller ? "bestseller" : null),
        spice_level: item.spice_level || (item.is_spicy ? "spicy" : "mild"),
      }));

    // Group items by category
    const categoriesWithItems = activeCategories.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.category_id === cat.id),
    }));

    // Also include uncategorized items if any
    const uncategorizedItems = items.filter(
      (item) => !item.category_id || !activeCategories.some((c) => c.id === item.category_id)
    );

    if (uncategorizedItems.length > 0) {
      categoriesWithItems.push({
        id: "other",
        restaurant_id: restaurant.id,
        name: "Chef's Specials",
        slug: "chefs-specials",
        description: "Signature dishes and accompaniments",
        icon: "Sparkles",
        image_url: null,
        sort_order: 9999,
        display_order: 9999,
        is_active: true,
        is_visible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: uncategorizedItems,
      });
    }

    // Determine menu status
    const menuStatus: PublicMenuData["menuStatus"] =
      restaurant.status === "active" ? "active" :
      restaurant.status === "suspended" ? "suspended" :
      restaurant.status === "archived" ? "archived" :
      "pending";

    // Fire-and-forget analytics scan event
    try {
      await (admin as any).from("analytics_events").insert({
        restaurant_id: restaurant.id,
        event_type: "menu_view",
        metadata: { slug },
      });
    } catch (_) { /* non-critical */ }

    return {
      restaurant,
      categories: categoriesWithItems,
      menuStatus,
    };
  } catch (err) {
    console.warn("Supabase connection failed, falling back to Demo data:", err);
    const categoriesWithItems = DEMO_CATEGORIES.map((cat) => ({
      ...cat,
      items: DEMO_ITEMS.filter((item) => item.category_id === cat.id),
    }));

    return {
      restaurant: DEMO_RESTAURANT,
      categories: categoriesWithItems,
      menuStatus: "active",
    };
  }
}
