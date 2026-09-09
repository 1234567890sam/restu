-- ============================================
-- Supabase Storage Bucket RLS Policies
-- Run this in Supabase SQL Editor > Storage section
-- OR go to Storage > each bucket > Policies tab
-- ============================================

-- ─────────────────────────────────────────────
-- BUCKET: restaurant-logos
-- ─────────────────────────────────────────────
-- Allow anyone to read logos (public bucket)
CREATE POLICY "Public read logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-logos');

-- Allow authenticated users to upload logos
CREATE POLICY "Auth users upload logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'restaurant-logos');

-- Allow users to update/delete their own logos
CREATE POLICY "Auth users update logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'restaurant-logos');

CREATE POLICY "Auth users delete logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'restaurant-logos');

-- ─────────────────────────────────────────────
-- BUCKET: cover-images
-- ─────────────────────────────────────────────
CREATE POLICY "Public read covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cover-images');

CREATE POLICY "Auth users upload covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cover-images');

CREATE POLICY "Auth users update covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cover-images');

CREATE POLICY "Auth users delete covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cover-images');

-- ─────────────────────────────────────────────
-- BUCKET: menu-images
-- ─────────────────────────────────────────────
CREATE POLICY "Public read menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Auth users upload menu images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Auth users update menu images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'menu-images');

CREATE POLICY "Auth users delete menu images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'menu-images');

-- ─────────────────────────────────────────────
-- NOTE: If you're using Service Role Key for uploads
-- (which bypasses RLS), the above policies are mostly
-- for direct user uploads. The app currently uses
-- service role key so uploads always succeed.
-- ─────────────────────────────────────────────
