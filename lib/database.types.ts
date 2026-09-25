export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: "owner" | "admin" | "super_admin" | "restaurant_owner";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: "owner" | "admin" | "super_admin" | "restaurant_owner";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: "owner" | "admin" | "super_admin" | "restaurant_owner";
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          tagline: string | null;
          description: string | null;
          phone: string | null;
          email: string | null;
          whatsapp: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          postal_code: string | null;
          currency: string | null;
          logo_url: string | null;
          cover_url: string | null;
          cover_image_url: string | null;
          banner_url: string | null;
          theme_color: string | null;
          secondary_color: string | null;
          template: "classic" | "modern" | "grid" | "minimal" | "compact" | "premium" | "card";
          font_family: string | null;
          opening_hours: string | Json | null;
          is_active: boolean;
          status: "pending" | "active" | "suspended" | "rejected" | "archived";
          subscription_plan: "free" | "basic" | "pro" | "enterprise";
          subscription_status: "active" | "trial" | "past_due" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          tagline?: string | null;
          description?: string | null;
          phone?: string | null;
          email?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          postal_code?: string | null;
          currency?: string | null;
          logo_url?: string | null;
          cover_url?: string | null;
          cover_image_url?: string | null;
          banner_url?: string | null;
          theme_color?: string | null;
          secondary_color?: string | null;
          template?: "classic" | "modern" | "grid" | "minimal" | "compact" | "premium" | "card";
          font_family?: string | null;
          opening_hours?: string | Json | null;
          is_active?: boolean;
          status?: "pending" | "active" | "suspended" | "rejected" | "archived";
          subscription_plan?: "free" | "basic" | "pro" | "enterprise";
          subscription_status?: "active" | "trial" | "past_due" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          owner_id?: string;
          name?: string;
          slug?: string;
          tagline?: string | null;
          description?: string | null;
          phone?: string | null;
          email?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          postal_code?: string | null;
          currency?: string | null;
          logo_url?: string | null;
          cover_url?: string | null;
          cover_image_url?: string | null;
          banner_url?: string | null;
          theme_color?: string | null;
          secondary_color?: string | null;
          template?: "classic" | "modern" | "grid" | "minimal" | "compact" | "premium" | "card";
          font_family?: string | null;
          opening_hours?: string | Json | null;
          is_active?: boolean;
          status?: "pending" | "active" | "suspended" | "rejected" | "archived";
          subscription_plan?: "free" | "basic" | "pro" | "enterprise";
          subscription_status?: "active" | "trial" | "past_due" | "cancelled";
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          slug?: string;
          description: string | null;
          icon: string | null;
          image_url: string | null;
          sort_order: number;
          display_order?: number;
          is_active: boolean;
          is_visible?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          image_url?: string | null;
          sort_order?: number;
          display_order?: number;
          is_active?: boolean;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          image_url?: string | null;
          sort_order?: number;
          display_order?: number;
          is_active?: boolean;
          is_visible?: boolean;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          offer_price: number | null;
          food_type: "veg" | "non-veg" | "vegan" | "egg";
          is_veg?: boolean;
          is_spicy?: boolean;
          is_bestseller?: boolean;
          spice_level: "mild" | "medium" | "spicy" | "extra_spicy" | null;
          badge: "bestseller" | "chef_special" | "new" | "must_try" | "none" | null;
          image_url: string | null;
          is_available: boolean;
          preparation_time: string | null;
          calories: number | null;
          allergens: string[] | null;
          sort_order: number;
          display_order?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          offer_price?: number | null;
          food_type?: "veg" | "non-veg" | "vegan" | "egg";
          is_veg?: boolean;
          is_spicy?: boolean;
          is_bestseller?: boolean;
          spice_level?: "mild" | "medium" | "spicy" | "extra_spicy" | null;
          badge?: "bestseller" | "chef_special" | "new" | "must_try" | "none" | null;
          image_url?: string | null;
          is_available?: boolean;
          preparation_time?: string | null;
          calories?: number | null;
          allergens?: string[] | null;
          sort_order?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          offer_price?: number | null;
          food_type?: "veg" | "non-veg" | "vegan" | "egg";
          is_veg?: boolean;
          is_spicy?: boolean;
          is_bestseller?: boolean;
          spice_level?: "mild" | "medium" | "spicy" | "extra_spicy" | null;
          badge?: "bestseller" | "chef_special" | "new" | "must_try" | "none" | null;
          image_url?: string | null;
          is_available?: boolean;
          preparation_time?: string | null;
          calories?: number | null;
          allergens?: string[] | null;
          sort_order?: number;
          display_order?: number;
          updated_at?: string;
        };
      };
      menu_settings: {
        Row: {
          id: string;
          restaurant_id: string;
          template: "classic" | "modern" | "grid" | "minimal" | "compact" | "premium" | "card";
          accent_color: string;
          font_preset: "default" | "elegant" | "modern" | "bold";
          show_description: boolean;
          show_images: boolean;
          show_badges: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          template?: "classic" | "modern" | "grid" | "minimal" | "compact" | "premium" | "card";
          accent_color?: string;
          font_preset?: "default" | "elegant" | "modern" | "bold";
          show_description?: boolean;
          show_images?: boolean;
          show_badges?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          template?: "classic" | "modern" | "grid" | "minimal" | "compact" | "premium" | "card";
          accent_color?: string;
          font_preset?: "default" | "elegant" | "modern" | "bold";
          show_description?: boolean;
          show_images?: boolean;
          show_badges?: boolean;
          updated_at?: string;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          restaurant_id: string;
          url: string;
          label: string | null;
          scan_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          url: string;
          label?: string | null;
          scan_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          url?: string;
          label?: string | null;
          scan_count?: number;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price_monthly: number;
          price_yearly: number;
          features: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price_monthly: number;
          price_yearly: number;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          price_monthly?: number;
          price_yearly?: number;
          features?: Json;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      restaurant_members: {
        Row: {
          id: string;
          restaurant_id: string;
          user_id: string;
          role: "owner" | "manager" | "staff";
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          user_id: string;
          role?: "owner" | "manager" | "staff";
          created_at?: string;
        };
        Update: {
          restaurant_id?: string;
          user_id?: string;
          role?: "owner" | "manager" | "staff";
        };
      };
      subscriptions: {
        Row: {
          id: string;
          restaurant_id: string;
          plan_id: string | null;
          status: "trial" | "active" | "past_due" | "suspended" | "cancelled" | "expired";
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          plan_id?: string | null;
          status?: "trial" | "active" | "past_due" | "suspended" | "cancelled" | "expired";
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan_id?: string | null;
          status?: "trial" | "active" | "past_due" | "suspended" | "cancelled" | "expired";
          current_period_start?: string | null;
          current_period_end?: string | null;
          updated_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          restaurant_id: string;
          event_type: "qr_scan" | "menu_view" | "item_view";
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          event_type?: "qr_scan" | "menu_view" | "item_view";
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          restaurant_id?: string;
          event_type?: "qr_scan" | "menu_view" | "item_view";
          metadata?: Json | null;
        };
      };
    };
  };
}

// Shorthand aliases
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type RestaurantMember = Database["public"]["Tables"]["restaurant_members"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  item_count?: number;
};
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type MenuSettings = Database["public"]["Tables"]["menu_settings"]["Row"];
export type QRCode = Database["public"]["Tables"]["qr_codes"]["Row"];
export type Plan = Database["public"]["Tables"]["plans"]["Row"];
