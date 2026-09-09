"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Maps our internal folder keys → actual Supabase bucket names
const BUCKET_MAP: Record<string, string> = {
  logos: "restaurant-logos",
  covers: "cover-images",
  items: "menu-images",
  categories: "menu-images",
};

export async function uploadImage(
  formData: FormData,
  folder: "logos" | "covers" | "items" | "categories" = "items"
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size exceeds 5MB limit" };
  }

  // Validate mime type
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedMimes.includes(file.type)) {
    return { error: "Only JPG, PNG, WEBP, and AVIF image formats are allowed" };
  }

  // Verify user is logged in (using regular client)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to upload images" };
  }

  // Use admin client for storage upload — bypasses RLS restrictions
  const adminClient = createAdminClient();

  const bucket = BUCKET_MAP[folder] ?? "menu-images";

  // Generate clean filename
  const extension = file.name.split(".").pop() || "jpg";
  const filename = `${user.id}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await adminClient.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error(`Storage upload error [bucket: ${bucket}]:`, error);
    return { error: error.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = adminClient.storage.from(bucket).getPublicUrl(filename);

  return { url: publicUrl };
}
