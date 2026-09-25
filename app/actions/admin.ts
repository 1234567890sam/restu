"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Restaurant } from "@/lib/database.types";

export interface RestaurantWithStats extends Restaurant {
  owner_email?: string;
  owner_name?: string;
  owner_email_verified?: boolean;
  categories_count?: number;
  items_count?: number;
}

// Check if currently authenticated user is super admin
export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const adminClient = createAdminClient();
  const { data } = await (adminClient as any)
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return (data as any)?.role === "super_admin";
}

// Fetch all restaurants
export async function getAllRestaurantsAdmin(): Promise<Restaurant[]> {
  const adminClient = createAdminClient();

  const { data, error } = await (adminClient as any)
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all restaurants:", error);
    return [];
  }

  return (data as unknown as Restaurant[]) || [];
}

// Fetch all restaurants with owner info, email verification status, and category/item counts
export async function getAllRestaurantsWithStatsAdmin(): Promise<RestaurantWithStats[]> {
  const adminClient = createAdminClient();

  try {
    const [restaurantsRes, usersRes, authUsersRes, categoriesRes, itemsRes] = await Promise.all([
      (adminClient as any).from("restaurants").select("*").order("created_at", { ascending: false }),
      (adminClient as any).from("users").select("id, email, full_name"),
      adminClient.auth.admin.listUsers({ perPage: 1000 }),
      (adminClient as any).from("categories").select("id, restaurant_id"),
      (adminClient as any).from("menu_items").select("id, restaurant_id"),
    ]);

    const restaurants: Restaurant[] = (restaurantsRes.data as unknown as Restaurant[]) || [];
    const users: Array<{ id: string; email: string; full_name?: string }> = usersRes.data || [];
    const authUsers = authUsersRes?.data?.users || [];
    const categories: Array<{ id: string; restaurant_id: string }> = categoriesRes.data || [];
    const items: Array<{ id: string; restaurant_id: string }> = itemsRes.data || [];

    const userMap = new Map<string, { email: string; full_name?: string }>();
    users.forEach((u) => userMap.set(u.id, u));

    const verifiedMap = new Map<string, boolean>();
    authUsers.forEach((u) => {
      verifiedMap.set(u.id, Boolean(u.email_confirmed_at));
    });

    const catCountMap = new Map<string, number>();
    categories.forEach((c) => {
      catCountMap.set(c.restaurant_id, (catCountMap.get(c.restaurant_id) || 0) + 1);
    });

    const itemCountMap = new Map<string, number>();
    items.forEach((i) => {
      itemCountMap.set(i.restaurant_id, (itemCountMap.get(i.restaurant_id) || 0) + 1);
    });

    return restaurants.map((r) => {
      const owner = userMap.get(r.owner_id);
      return {
        ...r,
        owner_email: owner?.email || "Unknown",
        owner_name: owner?.full_name || "Owner",
        owner_email_verified: verifiedMap.has(r.owner_id) ? verifiedMap.get(r.owner_id) : true,
        categories_count: catCountMap.get(r.id) || 0,
        items_count: itemCountMap.get(r.id) || 0,
      };
    });
  } catch (err) {
    console.error("Error fetching restaurants with stats:", err);
    return [];
  }
}

// Manually verify a user's email (Super Admin Action)
export async function verifyUserEmailAdmin(
  userId: string
): Promise<{ success?: string; error?: string }> {
  const isAuth = await isSuperAdmin();
  if (!isAuth) {
    return { error: "Unauthorized: Super Admin access required." };
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  if (error) {
    console.error("Error verifying email:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/restaurants");
  revalidatePath("/admin");
  return { success: `Email for ${data.user?.email || "user"} marked as verified!` };
}

// Approve restaurant (Super Admin) - Also auto-verifies owner's email
export async function approveRestaurantAdmin(
  restaurantId: string
): Promise<{ success?: string; error?: string }> {
  const adminClient = createAdminClient();

  // Find owner to auto-verify their email
  const { data: restaurant } = await (adminClient as any)
    .from("restaurants")
    .select("owner_id, name")
    .eq("id", restaurantId)
    .maybeSingle();

  if (restaurant?.owner_id) {
    await adminClient.auth.admin.updateUserById(restaurant.owner_id, {
      email_confirm: true,
    });
  }

  const { error } = await (adminClient as any)
    .from("restaurants")
    .update({
      status: "active",
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/restaurants");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: "Restaurant approved & owner email verified successfully!" };
}

// Reject restaurant (Super Admin)
export async function rejectRestaurantAdmin(
  restaurantId: string
): Promise<{ success?: string; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("restaurants")
    .update({
      status: "rejected",
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/restaurants");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: "Restaurant application marked as rejected." };
}

// Update restaurant status or plan
export async function updateRestaurantStatusAdmin(
  restaurantId: string,
  isActive: boolean,
  status?: "pending" | "active" | "suspended" | "rejected"
): Promise<{ success?: string; error?: string }> {
  const adminClient = createAdminClient();

  const updateData: any = {
    is_active: isActive,
    updated_at: new Date().toISOString(),
  };

  if (status) {
    updateData.status = status;
  } else {
    updateData.status = isActive ? "active" : "suspended";
  }

  const { error } = await (adminClient as any)
    .from("restaurants")
    .update(updateData)
    .eq("id", restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/restaurants");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: "Restaurant status updated!" };
}

export async function updateRestaurantPlanAdmin(
  restaurantId: string,
  plan: string
): Promise<{ success?: string; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("restaurants")
    .update({
      subscription_plan: plan,
      updated_at: new Date().toISOString(),
    })
    .eq("id", restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/restaurants");
  revalidatePath("/admin");
  return { success: "Subscription plan updated!" };
}

// Update full restaurant details (Super Admin)
export async function updateRestaurantDetailsAdmin(
  restaurantId: string,
  data: {
    name: string;
    slug: string;
    phone?: string;
    whatsapp?: string;
    city?: string;
    state?: string;
    address?: string;
    tagline?: string;
    description?: string;
    status?: "pending" | "active" | "suspended" | "rejected";
    isActive?: boolean;
    subscriptionPlan?: string;
  }
): Promise<{ success?: string; error?: string }> {
  const isAuth = await isSuperAdmin();
  if (!isAuth) {
    return { error: "Unauthorized: Super Admin access required." };
  }

  const adminClient = createAdminClient();

  const cleanSlug = data.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Verify slug uniqueness if slug changed
  const { data: existingSlug } = await (adminClient as any)
    .from("restaurants")
    .select("id")
    .eq("slug", cleanSlug)
    .neq("id", restaurantId)
    .maybeSingle();

  if (existingSlug) {
    return { error: `Slug "/r/${cleanSlug}" is already taken by another restaurant.` };
  }

  const updatePayload: Record<string, any> = {
    name: data.name.trim(),
    slug: cleanSlug,
    phone: data.phone?.trim() || null,
    whatsapp: data.whatsapp?.trim() || null,
    city: data.city?.trim() || "Solapur",
    state: data.state?.trim() || "Maharashtra",
    address: data.address?.trim() || null,
    tagline: data.tagline?.trim() || null,
    description: data.description?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (data.status) {
    updatePayload.status = data.status;
    updatePayload.is_active = data.status === "active";
  } else if (data.isActive !== undefined) {
    updatePayload.is_active = data.isActive;
    updatePayload.status = data.isActive ? "active" : "suspended";
  }

  if (data.subscriptionPlan) {
    updatePayload.subscription_plan = data.subscriptionPlan;
  }

  const { error } = await (adminClient as any)
    .from("restaurants")
    .update(updatePayload)
    .eq("id", restaurantId);

  if (error) {
    console.error("Error updating restaurant:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/restaurants");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath(`/r/${cleanSlug}`);

  return { success: "Restaurant details updated successfully!" };
}

// Delete restaurant and all associated records (Super Admin)
export async function deleteRestaurantAdmin(
  restaurantId: string
): Promise<{ success?: string; error?: string }> {
  const isAuth = await isSuperAdmin();
  if (!isAuth) {
    return { error: "Unauthorized: Super Admin access required." };
  }

  const adminClient = createAdminClient();

  try {
    // Delete in sequence: menu_items, categories, restaurant_members, restaurants
    await (adminClient as any).from("menu_items").delete().eq("restaurant_id", restaurantId);
    await (adminClient as any).from("categories").delete().eq("restaurant_id", restaurantId);
    await (adminClient as any).from("restaurant_members").delete().eq("restaurant_id", restaurantId);
    
    const { error } = await (adminClient as any)
      .from("restaurants")
      .delete()
      .eq("id", restaurantId);

    if (error) {
      return { error: error.message };
    }

    // If active cookie points to this restaurant, clear it
    const cookieStore = await cookies();
    if (cookieStore.get("admin_active_restaurant_id")?.value === restaurantId) {
      cookieStore.delete("admin_active_restaurant_id");
    }

    revalidatePath("/admin/restaurants");
    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return { success: "Restaurant and all associated menu data deleted permanently." };
  } catch (err: any) {
    return { error: err.message || "Failed to delete restaurant." };
  }
}

// Switch active restaurant for Super Admin to manage in Dashboard
export async function switchAdminActiveRestaurant(
  restaurantId: string
): Promise<{ success?: string; error?: string }> {
  const isAuth = await isSuperAdmin();
  if (!isAuth) {
    return { error: "Unauthorized: Super Admin access required." };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_active_restaurant_id", restaurantId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/qr");
  revalidatePath("/dashboard/appearance");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");

  return { success: "Active restaurant switched!" };
}

// Clear active restaurant cookie for Super Admin
export async function clearAdminActiveRestaurant(): Promise<{ success?: string }> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_active_restaurant_id");
  revalidatePath("/dashboard");
  return { success: "Reset to default restaurant." };
}

// Super Admin: Direct Restaurant Creation
export async function createRestaurantDirectAdmin(formData: FormData): Promise<{
  success?: string;
  error?: string;
  restaurant?: Restaurant;
}> {
  const isAuth = await isSuperAdmin();
  if (!isAuth) {
    return { error: "Unauthorized: Super Admin access required." };
  }

  const name = (formData.get("name") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const ownerEmail = (formData.get("ownerEmail") as string)?.trim()?.toLowerCase();
  const ownerName = (formData.get("ownerName") as string)?.trim() || `${name} Owner`;
  const ownerPassword = (formData.get("ownerPassword") as string)?.trim() || "MenuQR@2025";
  const phone = (formData.get("phone") as string)?.trim();
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const city = (formData.get("city") as string)?.trim() || "Solapur";
  const state = (formData.get("state") as string)?.trim() || "Maharashtra";
  const plan = (formData.get("plan") as string)?.trim() || "pro";

  if (!name) {
    return { error: "Restaurant Name is required." };
  }
  if (!ownerEmail) {
    return { error: "Owner Email is required." };
  }

  // Sanitize slug
  if (!slug) {
    slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  } else {
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  try {
    const adminClient = createAdminClient();

    // 1. Check if slug already taken
    const { data: existingSlug } = await adminClient
      .from("restaurants")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 2. Check if owner user already exists in public.users
    let ownerId: string;
    const { data: existingUser } = await (adminClient as any)
      .from("users")
      .select("id")
      .eq("email", ownerEmail)
      .maybeSingle();

    if (existingUser && (existingUser as any).id) {
      ownerId = (existingUser as any).id;
    } else {
      // Create user in Supabase Auth via Admin API
      const { data: authUser, error: authError } =
        await adminClient.auth.admin.createUser({
          email: ownerEmail,
          password: ownerPassword,
          email_confirm: true,
          user_metadata: { full_name: ownerName },
        });

      if (authError || !authUser.user) {
        return {
          error:
            authError?.message ||
            "Failed to create authentication user for owner.",
        };
      }

      ownerId = authUser.user.id;

      // Upsert into public.users
      await (adminClient as any).from("users").upsert({
        id: ownerId,
        email: ownerEmail,
        full_name: ownerName,
        role: "restaurant_owner",
      });
    }

    // 3. Create restaurant directly as ACTIVE
    const restaurantPayload: any = {
      owner_id: ownerId,
      name,
      slug,
      phone: phone || null,
      whatsapp: whatsapp || null,
      city: city || "Solapur",
      state: state || "Maharashtra",
      country: "India",
      template: "classic",
      status: "active",
      is_active: true,
      subscription_plan: plan,
      subscription_status: "active",
      theme_color: "#f59e0b",
      tagline: "Delicious dining experience",
    };

    let { data: newRestaurant, error: restError } = await (adminClient as any)
      .from("restaurants")
      .insert(restaurantPayload)
      .select()
      .single();

    // Dynamic fallback if any column missing in PostgREST cache
    let attempts = 0;
    while (restError && attempts < 10) {
      attempts++;
      const match = restError.message?.match(/Could not find the '([^']+)' column/i);
      if (match && match[1] && match[1] in restaurantPayload) {
        console.warn(`Stripping missing column '${match[1]}' and retrying.`);
        delete restaurantPayload[match[1]];
        const retry = await (adminClient as any)
          .from("restaurants")
          .insert(restaurantPayload)
          .select()
          .single();
        newRestaurant = retry.data;
        restError = retry.error;
      } else {
        break;
      }
    }

    if (restError) {
      console.error("Direct restaurant insert error:", restError);
      return { error: restError.message || "Failed to create restaurant." };
    }

    // 4. Create restaurant_members record
    await (adminClient as any).from("restaurant_members").upsert(
      {
        restaurant_id: (newRestaurant as any).id,
        user_id: ownerId,
        role: "owner",
      },
      { onConflict: "restaurant_id,user_id" }
    );

    revalidatePath("/admin/restaurants");
    revalidatePath("/admin");

    return {
      success: `Restaurant "${name}" created and activated successfully!`,
      restaurant: newRestaurant as unknown as Restaurant,
    };
  } catch (err: any) {
    console.error("Direct restaurant creation error:", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}
