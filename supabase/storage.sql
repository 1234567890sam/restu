-- ============================================
-- Storage Buckets & Policies
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-logos', 'restaurant-logos', TRUE);
INSERT INTO storage.buckets (id, name, public) VALUES ('cover-images', 'cover-images', TRUE);
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', TRUE);

-- ============================================
-- RESTAURANT LOGOS BUCKET POLICIES
-- ============================================
-- Anyone can view logos (public bucket)
CREATE POLICY "Public can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-logos');

-- Restaurant members can upload logos
-- File path should be: restaurant_id/logo.ext
CREATE POLICY "Members can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-logos' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

-- Restaurant members can update logos
CREATE POLICY "Members can update logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'restaurant-logos' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

-- Restaurant members can delete logos
CREATE POLICY "Members can delete logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-logos' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

-- ============================================
-- COVER IMAGES BUCKET POLICIES
-- ============================================
CREATE POLICY "Public can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cover-images');

CREATE POLICY "Members can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cover-images' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

CREATE POLICY "Members can update cover images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cover-images' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

CREATE POLICY "Members can delete cover images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cover-images' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

-- ============================================
-- MENU IMAGES BUCKET POLICIES
-- ============================================
CREATE POLICY "Public can view menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Members can upload menu images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-images' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

CREATE POLICY "Members can update menu images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'menu-images' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );

CREATE POLICY "Members can delete menu images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-images' AND
    public.is_restaurant_member((storage.foldername(name))[1]::UUID)
  );
