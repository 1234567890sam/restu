-- ============================================
-- Row Level Security Policies
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER: Check if user is a member of a restaurant
-- ============================================
CREATE OR REPLACE FUNCTION public.is_restaurant_member(r_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.restaurant_members
    WHERE restaurant_id = r_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER: Check if user is a super admin
-- ============================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- USERS POLICIES
-- ============================================
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Super admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_super_admin());

-- ============================================
-- RESTAURANTS POLICIES
-- ============================================
-- Public: Anyone can view active restaurants (for customer menu)
CREATE POLICY "Anyone can view active restaurants"
  ON public.restaurants FOR SELECT
  USING (status = 'active');

-- Members can view their restaurant regardless of status
CREATE POLICY "Members can view their restaurant"
  ON public.restaurants FOR SELECT
  USING (public.is_restaurant_member(id));

-- Only owner can update their restaurant
CREATE POLICY "Owner can update restaurant"
  ON public.restaurants FOR UPDATE
  USING (owner_id = auth.uid());

-- Authenticated users can create restaurants
CREATE POLICY "Authenticated users can create restaurants"
  ON public.restaurants FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Super admins can do everything
CREATE POLICY "Super admins full access to restaurants"
  ON public.restaurants FOR ALL
  USING (public.is_super_admin());

-- ============================================
-- RESTAURANT MEMBERS POLICIES
-- ============================================
CREATE POLICY "Members can view membership"
  ON public.restaurant_members FOR SELECT
  USING (user_id = auth.uid() OR public.is_restaurant_member(restaurant_id));

CREATE POLICY "Owner can manage members"
  ON public.restaurant_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own membership"
  ON public.restaurant_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- CATEGORIES POLICIES
-- ============================================
-- Public: Anyone can view visible categories of active restaurants
CREATE POLICY "Public can view visible categories"
  ON public.categories FOR SELECT
  USING (
    is_visible = TRUE AND
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND status = 'active'
    )
  );

-- Members can view all categories (including hidden ones)
CREATE POLICY "Members can view all categories"
  ON public.categories FOR SELECT
  USING (public.is_restaurant_member(restaurant_id));

-- Members can manage categories
CREATE POLICY "Members can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "Members can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_restaurant_member(restaurant_id));

CREATE POLICY "Members can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_restaurant_member(restaurant_id));

-- ============================================
-- MENU ITEMS POLICIES
-- ============================================
-- Public: Anyone can view available items of active restaurants
CREATE POLICY "Public can view menu items"
  ON public.menu_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND status = 'active'
    )
  );

-- Members can manage menu items
CREATE POLICY "Members can insert menu items"
  ON public.menu_items FOR INSERT
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "Members can update menu items"
  ON public.menu_items FOR UPDATE
  USING (public.is_restaurant_member(restaurant_id));

CREATE POLICY "Members can delete menu items"
  ON public.menu_items FOR DELETE
  USING (public.is_restaurant_member(restaurant_id));

-- ============================================
-- MENU SETTINGS POLICIES
-- ============================================
-- Public can view settings (needed to render template)
CREATE POLICY "Public can view menu settings"
  ON public.menu_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND status = 'active'
    )
  );

-- Members can manage settings
CREATE POLICY "Members can manage menu settings"
  ON public.menu_settings FOR ALL
  USING (public.is_restaurant_member(restaurant_id));

-- ============================================
-- QR CODES POLICIES
-- ============================================
CREATE POLICY "Members can view QR codes"
  ON public.qr_codes FOR SELECT
  USING (public.is_restaurant_member(restaurant_id));

CREATE POLICY "Members can manage QR codes"
  ON public.qr_codes FOR ALL
  USING (public.is_restaurant_member(restaurant_id));

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================
CREATE POLICY "Members can view subscription"
  ON public.subscriptions FOR SELECT
  USING (public.is_restaurant_member(restaurant_id));

CREATE POLICY "Super admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_super_admin());

-- ============================================
-- PLANS POLICIES
-- ============================================
-- Everyone can view active plans
CREATE POLICY "Anyone can view active plans"
  ON public.plans FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Super admins can manage plans"
  ON public.plans FOR ALL
  USING (public.is_super_admin());

-- ============================================
-- ANALYTICS EVENTS POLICIES
-- ============================================
-- Anyone can insert analytics events (for QR scans)
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (TRUE);

-- Members can view their analytics
CREATE POLICY "Members can view analytics"
  ON public.analytics_events FOR SELECT
  USING (public.is_restaurant_member(restaurant_id));

-- Super admins can view all analytics
CREATE POLICY "Super admins can view all analytics"
  ON public.analytics_events FOR SELECT
  USING (public.is_super_admin());
