-- ReWear Storage Setup Script
-- Run this in your Supabase SQL Editor after the database setup

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for item images
CREATE POLICY "Anyone can view item images" ON storage.objects
  FOR SELECT USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'item-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own item images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'item-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own item images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'item-images' AND 
    auth.role() = 'authenticated'
  ); 