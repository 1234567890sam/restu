"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Restaurant } from "@/lib/database.types";

// Get currently logged-in user's restaurant
export async function getCurrentRestaurant(): Promise<Restaurant | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    const adminClient = createAdminClient();

    // 0. Super Admin check: If super admin selected a specific restaurant to manage, respect that!
    const { data: userProfile } = await (adminClient as any)
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isSuperAdmin = userProfile?.role === "super_admin";

    if (isSuperAdmin) {
      const cookieStore = await cookies();
      const switchedRestId = cookieStore.get("admin_active_restaurant_id")?.value;
      if (switchedRestId) {
        const { data: switchedRest } = await (adminClient as any)
          .from("restaurants")
          .select("*")
          .eq("id", switchedRestId)
          .maybeSingle();

        if (switchedRest) {
          return switchedRest as unknown as Restaurant;
        }
      }
    }

    // 1. Direct owner check
    const { data: ownedRestaurant, error: ownerError } = await (adminClient as any)
      .from("restaurants")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (ownerError && ownerError.code !== "PGRST116") {
      console.warn("Notice checking owned restaurant:", ownerError.message);
    }

    if (ownedRestaurant) {
      return ownedRestaurant as unknown as Restaurant;
    }

    // 2. Member check via restaurant_members
    const { data: memberRecord } = await (adminClient as any)
      .from("restaurant_members")
      .select("restaurant_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (memberRecord?.restaurant_id) {
      const { data: memberRestaurant } = await (adminClient as any)
        .from("restaurants")
        .select("*")
        .eq("id", memberRecord.restaurant_id)
        .maybeSingle();

      if (memberRestaurant) {
        return memberRestaurant as unknown as Restaurant;
      }
    }

    // 3. If super admin accessing dashboard without cookie, show the most recent restaurant for preview
    if (isSuperAdmin) {
      const { data: recentRestaurant } = await (adminClient as any)
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recentRestaurant) {
        return recentRestaurant as unknown as Restaurant;
      }
    }

    // 4. Auto-create a restaurant for this user if none exists so they are never blocked!
    const userEmail = user.email || "my-restaurant";
    const rawName =
      (user.user_metadata as any)?.restaurant_name ||
      (user.user_metadata as any)?.full_name ||
      userEmail.split("@")[0] ||
      "My Restaurant";

    const baseName =
      rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const slugBase = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanSlug = `${slugBase || "restaurant"}-${user.id.substring(0, 5)}`;

    const { data: autoRestaurant } = await (adminClient as any)
      .from("restaurants")
      .insert({
        owner_id: user.id,
        name: baseName.includes("Hotel") || baseName.includes("Restaurant") || baseName.includes("Cafe")
          ? baseName
          : `${baseName} Restaurant`,
        slug: cleanSlug,
        city: "Solapur",
        state: "Maharashtra",
        country: "India",
        currency: "INR",
        template: "classic",
        status: "active",
        is_active: true,
        subscription_plan: "pro",
        subscription_status: "active",
        theme_color: "#f59e0b",
        tagline: "Delicious dining experience",
      })
      .select()
      .maybeSingle();

    if (autoRestaurant) {
      await (adminClient as any).from("restaurant_members").upsert(
        {
          restaurant_id: autoRestaurant.id,
          user_id: user.id,
          role: "owner",
        },
        { onConflict: "restaurant_id,user_id" }
      );
      return autoRestaurant as unknown as Restaurant;
    }

    return null;
  } catch (err: any) {
    console.warn("Notice in getCurrentRestaurant:", err?.message || err);
    return null;
  }
}

// Update restaurant profile
export async function updateRestaurantProfile(
  restaurantId: string,
  formData: FormData
): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const tagline = (formData.get("tagline") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const email = (formData.get("email") as string) || "";
  const address = (formData.get("address") as string) || "";
  const city = (formData.get("city") as string) || "";
  const state = (formData.get("state") as string) || "";
  const postalCode = (formData.get("postal_code") as string) || "";
  const openingHours = (formData.get("opening_hours") as string) || "";
  const logoUrl = (formData.get("logo_url") as string) || null;
  const coverUrl = (formData.get("cover_image_url") as string) || null;

  const { error } = await (admin as any)
    .from("restaurants")
    .update({
      name,
      description,
      tagline,
      phone,
      email,
      address,
      city,
      state,
      postal_code: postalCode,
      opening_hours: openingHours,
      logo_url: logoUrl,
      cover_image_url: coverUrl,
      cover_url: coverUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { success: "Restaurant profile updated successfully!" };
}

export async function updateRestaurantAppearance(
  restaurantId: string,
  data: {
    template?: "classic" | "modern" | "grid" | "minimal" | "compact" | "premium" | "card";
    themeColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    bannerUrl?: string | null;
  }
): Promise<{ success?: string; error?: string }> {
  const admin = createAdminClient();

  const { error } = await (admin as any)
    .from("restaurants")
    .update({
      template: data.template,
      theme_color: data.themeColor,
      secondary_color: data.secondaryColor,
      font_family: data.fontFamily,
      banner_url: data.bannerUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/appearance");
  revalidatePath(`/r/${(await (admin as any).from("restaurants").select("slug").eq("id", restaurantId).maybeSingle()).data?.slug}`);
  return { success: "Design and appearance updated successfully!" };
}
