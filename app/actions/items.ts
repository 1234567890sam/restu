"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { MenuItem } from "@/lib/database.types";

export async function getMenuItems(
  restaurantId: string,
  filter?: {
    categoryId?: string;
    foodType?: "veg" | "non-veg" | "vegan" | "egg";
    search?: string;
    isAvailable?: boolean;
  }
): Promise<MenuItem[]> {
  const admin = createAdminClient();
  let query = (admin as any)
    .from("menu_items")
    .select("*, categories(name)")
    .eq("restaurant_id", restaurantId);

  if (filter?.categoryId) {
    query = query.eq("category_id", filter.categoryId);
  }
  if (filter?.isAvailable !== undefined) {
    query = query.eq("is_available", filter.isAvailable);
  }
  if (filter?.search) {
    query = query.ilike("name", `%${filter.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }

  // Sort in-memory by display_order
  const sorted = (data || []).sort((a: any, b: any) => {
    const orderA = a.display_order ?? a.sort_order ?? 0;
    const orderB = b.display_order ?? b.sort_order ?? 0;
    return orderA - orderB;
  });

  let items = sorted.map((item: any) => ({
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

  if (filter?.foodType) {
    items = items.filter((i: any) => i.food_type === filter.foodType);
  }

  return items as MenuItem[];
}

export async function getMenuItem(itemId: string): Promise<MenuItem | null> {
  const admin = createAdminClient();
  const { data, error } = await (admin as any)
    .from("menu_items")
    .select("*")
    .eq("id", itemId)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching item:", error);
    return null;
  }

  return {
    ...data,
    food_type: data.food_type || (data.is_veg ? "veg" : "non-veg"),
    is_veg: data.is_veg ?? true,
    is_spicy: data.is_spicy ?? false,
    is_bestseller: data.is_bestseller ?? false,
    sort_order: data.display_order ?? data.sort_order ?? 0,
    display_order: data.display_order ?? data.sort_order ?? 0,
    badge: data.badge || (data.is_bestseller ? "bestseller" : null),
    spice_level: data.spice_level || (data.is_spicy ? "spicy" : "mild"),
  } as MenuItem;
}

export async function createMenuItem(
  restaurantId: string,
  data: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    offerPrice?: number | null;
    foodType?: "veg" | "non-veg" | "vegan" | "egg";
    spiceLevel?: "mild" | "medium" | "spicy" | "extra_spicy" | null;
    badge?: "bestseller" | "chef_special" | "new" | "must_try" | "none" | null;
    imageUrl?: string | null;
    isAvailable?: boolean;
    preparationTime?: string | null;
    calories?: number | null;
    allergens?: string[];
  }
): Promise<{ success?: string; error?: string; item?: MenuItem }> {
  const admin = createAdminClient();

  // Get next display_order
  const { data: existing } = await (admin as any)
    .from("menu_items")
    .select("display_order")
    .eq("restaurant_id", restaurantId);

  const maxOrder = (existing || []).reduce(
    (max: number, i: any) => Math.max(max, i.display_order ?? 0),
    -1
  );
  const nextOrder = maxOrder + 1;

  const isVeg = data.foodType ? data.foodType === "veg" || data.foodType === "vegan" : true;
  const isSpicy = data.spiceLevel ? data.spiceLevel === "spicy" || data.spiceLevel === "extra_spicy" : false;
  const isBestseller = data.badge === "bestseller";

  const insertPayload: Record<string, any> = {
    restaurant_id: restaurantId,
    category_id: data.categoryId,
    name: data.name,
    description: data.description || null,
    price: data.price,
    offer_price: data.offerPrice ?? null,
    image_url: data.imageUrl || null,
    food_type: data.foodType || (isVeg ? "veg" : "non-veg"),
    is_veg: isVeg,
    spice_level: data.spiceLevel || (isSpicy ? "spicy" : "mild"),
    is_spicy: isSpicy,
    badge: data.badge && data.badge !== "none" ? data.badge : null,
    is_bestseller: isBestseller,
    is_available: data.isAvailable ?? true,
    preparation_time: data.preparationTime || null,
    calories: data.calories || null,
    allergens: data.allergens || null,
    display_order: nextOrder,
  };

  const { data: newItem, error } = await (admin as any)
    .from("menu_items")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("Error creating menu item:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
  await revalidateRestaurantMenu(admin, restaurantId);

  const mappedItem: MenuItem = {
    ...newItem,
    food_type: data.foodType || (isVeg ? "veg" : "non-veg"),
    is_veg: isVeg,
    is_spicy: isSpicy,
    is_bestseller: isBestseller,
    sort_order: nextOrder,
    display_order: nextOrder,
    badge: data.badge && data.badge !== "none" ? data.badge : null,
    spice_level: data.spiceLevel || null,
    offer_price: data.offerPrice ?? null,
    preparation_time: data.preparationTime || null,
  };

  return { success: "Menu item created successfully!", item: mappedItem };
}

async function revalidateRestaurantMenu(admin: any, restaurantId: string) {
  try {
    const { data: rest } = await (admin as any)
      .from("restaurants")
      .select("slug")
      .eq("id", restaurantId)
      .maybeSingle();
    if (rest?.slug) {
      revalidatePath(`/r/${rest.slug}`);
    }
  } catch (e) {
    console.warn("Notice during menu revalidation:", e);
  }
}

export async function updateMenuItem(
  itemId: string,
  data: {
    categoryId?: string;
    name?: string;
    description?: string;
    price?: number;
    offerPrice?: number | null;
    foodType?: "veg" | "non-veg" | "vegan" | "egg";
    spiceLevel?: "mild" | "medium" | "spicy" | "extra_spicy" | null;
    badge?: "bestseller" | "chef_special" | "new" | "must_try" | "none" | null;
    imageUrl?: string | null;
    isAvailable?: boolean;
    preparationTime?: string | null;
    calories?: number | null;
    allergens?: string[];
  }
): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.offerPrice !== undefined) updateData.offer_price = data.offerPrice;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.isAvailable !== undefined) updateData.is_available = data.isAvailable;
  if (data.preparationTime !== undefined) updateData.preparation_time = data.preparationTime;
  if (data.calories !== undefined) updateData.calories = data.calories;
  if (data.allergens !== undefined) updateData.allergens = data.allergens;

  if (data.foodType !== undefined) {
    updateData.food_type = data.foodType;
    updateData.is_veg = data.foodType === "veg" || data.foodType === "vegan";
  }
  if (data.spiceLevel !== undefined) {
    updateData.spice_level = data.spiceLevel;
    updateData.is_spicy = data.spiceLevel === "spicy" || data.spiceLevel === "extra_spicy";
  }
  if (data.badge !== undefined) {
    updateData.badge = data.badge === "none" ? null : data.badge;
    updateData.is_bestseller = data.badge === "bestseller";
  }

  const { data: itemRecord } = await (admin as any)
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", itemId)
    .maybeSingle();

  const { error } = await (admin as any)
    .from("menu_items")
    .update(updateData)
    .eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
  if (itemRecord?.restaurant_id) {
    await revalidateRestaurantMenu(admin, itemRecord.restaurant_id);
  }
  return { success: "Menu item updated successfully!" };
}

export async function toggleItemAvailability(
  itemId: string,
  isAvailable: boolean
): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  const { data: itemRecord } = await (admin as any)
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", itemId)
    .maybeSingle();

  const { error } = await (admin as any)
    .from("menu_items")
    .update({
      is_available: isAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
  if (itemRecord?.restaurant_id) {
    await revalidateRestaurantMenu(admin, itemRecord.restaurant_id);
  }
  return { success: `Item marked as ${isAvailable ? "Available" : "Unavailable"}` };
}

export async function deleteMenuItem(itemId: string): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  const { data: itemRecord } = await (admin as any)
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", itemId)
    .maybeSingle();

  const { error } = await (admin as any)
    .from("menu_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
  if (itemRecord?.restaurant_id) {
    await revalidateRestaurantMenu(admin, itemRecord.restaurant_id);
  }
  return { success: "Menu item deleted!" };
}
