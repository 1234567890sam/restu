"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Category } from "@/lib/database.types";

export async function getCategories(restaurantId: string): Promise<Category[]> {
  const admin = createAdminClient();
  const { data, error } = await (admin as any)
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // Sort by display_order or created_at in memory to avoid column missing errors
  const sorted = (data || []).sort((a: any, b: any) => {
    const orderA = a.display_order ?? a.sort_order ?? 0;
    const orderB = b.display_order ?? b.sort_order ?? 0;
    return orderA - orderB;
  });

  return sorted.map((cat: any) => ({
    ...cat,
    sort_order: cat.sort_order ?? cat.display_order ?? 0,
    display_order: cat.display_order ?? cat.sort_order ?? 0,
    is_active: cat.is_active ?? cat.is_visible ?? true,
    is_visible: cat.is_visible ?? cat.is_active ?? true,
    icon: cat.icon || "Utensils",
  })) as Category[];
}

export async function createCategory(
  restaurantId: string,
  data: {
    name: string;
    description?: string;
    icon?: string;
    imageUrl?: string | null;
  }
): Promise<{ success?: string; error?: string; category?: Category }> {
  const admin = createAdminClient();

  // Get max display order
  const { data: existing } = await (admin as any)
    .from("categories")
    .select("display_order")
    .eq("restaurant_id", restaurantId);

  const maxOrder = (existing || []).reduce(
    (max: number, c: any) => Math.max(max, c.display_order ?? 0),
    -1
  );
  const nextOrder = maxOrder + 1;

  const baseSlug = data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${baseSlug || "category"}-${Math.random().toString(36).substring(2, 6)}`;

  const insertPayload: Record<string, any> = {
    restaurant_id: restaurantId,
    name: data.name,
    slug: slug,
    description: data.description || null,
    display_order: nextOrder,
    is_visible: true,
  };

  const { data: newCat, error } = await (admin as any)
    .from("categories")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");

  const mappedCat: Category = {
    ...newCat,
    sort_order: newCat.display_order ?? 0,
    display_order: newCat.display_order ?? 0,
    is_active: newCat.is_visible ?? true,
    is_visible: newCat.is_visible ?? true,
    icon: data.icon || "Utensils",
  };

  return { success: "Category created!", category: mappedCat };
}

export async function updateCategory(
  categoryId: string,
  data: {
    name?: string;
    description?: string;
    icon?: string;
    imageUrl?: string | null;
    isActive?: boolean;
  }
): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.isActive !== undefined) {
    updateData.is_visible = data.isActive;
  }

  const { error } = await (admin as any)
    .from("categories")
    .update(updateData)
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
  return { success: "Category updated!" };
}

export async function deleteCategory(categoryId: string): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  const { error } = await (admin as any)
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
  return { success: "Category deleted!" };
}

export async function reorderCategories(
  restaurantId: string,
  categoryIds: string[]
): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  try {
    const updates = categoryIds.map((id, index) =>
      (admin as any)
        .from("categories")
        .update({
          display_order: index,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("restaurant_id", restaurantId)
    );

    await Promise.all(updates);
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/items");
    revalidatePath("/dashboard");
    return { success: "Categories reordered!" };
  } catch (err: any) {
    return { error: err.message || "Failed to reorder" };
  }
}
