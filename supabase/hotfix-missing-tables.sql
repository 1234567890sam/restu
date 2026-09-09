-- ============================================
-- HOTFIX: Run this in Supabase SQL Editor
-- Fixes missing tables + adds member rows
-- ============================================

-- 1. Create restaurant_members table
CREATE TABLE IF NOT EXISTS public.restaurant_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(restaurant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_restaurant_members_user ON public.restaurant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_members_restaurant ON public.restaurant_members(restaurant_id);

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'suspended', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'qr_scan' CHECK (event_type IN ('qr_scan', 'menu_view', 'item_view')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_restaurant ON public.analytics_events(restaurant_id);

-- 4. Enable RLS on new tables
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 5. Auto-create restaurant_members trigger
CREATE OR REPLACE FUNCTION public.auto_add_restaurant_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.restaurant_members (restaurant_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT (restaurant_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_restaurant_created ON public.restaurants;
CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.auto_add_restaurant_member();

-- 6. FIX EXISTING DATA: Add all current owners as members
INSERT INTO public.restaurant_members (restaurant_id, user_id, role)
SELECT id, owner_id, 'owner'
FROM public.restaurants
ON CONFLICT (restaurant_id, user_id) DO NOTHING;

-- 7. Create RLS helper functions (if not exists)
CREATE OR REPLACE FUNCTION public.is_restaurant_member(r_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.restaurant_members
    WHERE restaurant_id = r_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RLS policies for restaurant_members
DROP POLICY IF EXISTS "Members can view membership" ON public.restaurant_members;
CREATE POLICY "Members can view membership"
  ON public.restaurant_members FOR SELECT
  USING (user_id = auth.uid() OR public.is_restaurant_member(restaurant_id));

DROP POLICY IF EXISTS "Owner can manage members" ON public.restaurant_members;
CREATE POLICY "Owner can manage members"
  ON public.restaurant_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own membership" ON public.restaurant_members;
CREATE POLICY "Users can insert own membership"
  ON public.restaurant_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 9. RLS policies for subscriptions
DROP POLICY IF EXISTS "Members can view subscription" ON public.subscriptions;
CREATE POLICY "Members can view subscription"
  ON public.subscriptions FOR SELECT
  USING (public.is_restaurant_member(restaurant_id));

DROP POLICY IF EXISTS "Super admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Super admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_super_admin());

-- 10. RLS policies for analytics_events
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics_events;
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Members can view analytics" ON public.analytics_events;
CREATE POLICY "Members can view analytics"
  ON public.analytics_events FOR SELECT
  USING (public.is_restaurant_member(restaurant_id));

DROP POLICY IF EXISTS "Super admins can view all analytics" ON public.analytics_events;
CREATE POLICY "Super admins can view all analytics"
  ON public.analytics_events FOR SELECT
  USING (public.is_super_admin());

-- 11. Also add owner-based SELECT policy for restaurants (fix for owner query)
DROP POLICY IF EXISTS "Owner can view own restaurant" ON public.restaurants;
CREATE POLICY "Owner can view own restaurant"
  ON public.restaurants FOR SELECT
  USING (owner_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Owner can update own restaurant" ON public.restaurants;
CREATE POLICY "Owner can update own restaurant"
  ON public.restaurants FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can manage all restaurants" ON public.restaurants;
CREATE POLICY "Super admins can manage all restaurants"
  ON public.restaurants FOR ALL
  USING (public.is_super_admin());

-- 12. Ensure all columns exist on public.restaurants (ADD COLUMN IF NOT EXISTS)
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Maharashtra';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Solapur';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT 'Delicious dining experience';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'classic';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#f59e0b';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'pro';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- Update check constraints safely
ALTER TABLE public.restaurants DROP CONSTRAINT IF EXISTS restaurants_status_check;
ALTER TABLE public.restaurants ADD CONSTRAINT restaurants_status_check 
  CHECK (status IN ('pending', 'active', 'suspended', 'rejected', 'archived'));

-- Reload Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Done! Refresh the page.
SELECT 'HOTFIX APPLIED SUCCESSFULLY' AS status, 
       (SELECT count(*) FROM public.restaurant_members) AS member_rows_created;

