"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";

export type AuthState = {
  error?: string;
  success?: string;
};

export async function login(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "Your email is not verified yet. Please check your inbox for the Supabase confirmation link, or contact Super Admin to verify your account directly.",
      };
    }
    return { error: error.message };
  }

  redirect(redirectTo);
}

export async function signup(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const restaurantName = formData.get("restaurantName") as string;
  const phone = (formData.get("phone") as string) || "";
  const city = (formData.get("city") as string) || "Solapur";

  if (!email || !password || !fullName || !restaurantName) {
    return { error: "Please fill in all required fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabase = await createClient();

  // Generate base slug
  let slug = slugify(restaurantName);
  if (!slug) slug = "restaurant-" + Math.floor(1000 + Math.random() * 9000);

  // Check slug uniqueness
  const { data: existingRestaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existingRestaurant) {
    slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  // Sign up user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        restaurant_name: restaurantName,
        phone,
        city,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Something went wrong creating your account." };
  }

  // Create or verify user profile
  await supabase.from("users").upsert({
    id: authData.user.id,
    email: authData.user.email!,
    full_name: fullName,
    role: "restaurant_owner",
  } as any);

  // Create restaurant with PENDING status — requires super admin approval
  const restPayload: any = {
    owner_id: authData.user.id,
    name: restaurantName,
    slug: slug,
    phone: phone,
    city: city,
    template: "classic",
    is_active: false,
    status: "pending",
    subscription_plan: "pro",
    subscription_status: "active",
    theme_color: "#f59e0b",
    tagline: "Delicious dining experience",
  };

  let { data: newRestaurant, error: restError } = await (supabase as any)
    .from("restaurants")
    .insert(restPayload)
    .select()
    .single();

  let attempts = 0;
  while (restError && attempts < 10) {
    attempts++;
    const match = restError.message?.match(/Could not find the '([^']+)' column/i);
    if (match && match[1] && match[1] in restPayload) {
      delete restPayload[match[1]];
      const retry = await (supabase as any)
        .from("restaurants")
        .insert(restPayload)
        .select()
        .single();
      newRestaurant = retry.data;
      restError = retry.error;
    } else {
      break;
    }
  }

  if (restError) {
    console.error("Error creating restaurant:", restError);
  }

  // If email confirmation is required:
  if (authData.session === null) {
    return {
      success:
        "Account created! Please check your email inbox to confirm your account before logging in.",
    };
  }

  return {
    success:
      "🎉 Registration successful! Your restaurant is under review. Our team will activate your account shortly. You will be able to access the dashboard once approved.",
  };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://menurestu.vercel.app");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Check your email for a password reset link!",
  };
}

export async function resetPassword(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Please fill in all password fields." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
