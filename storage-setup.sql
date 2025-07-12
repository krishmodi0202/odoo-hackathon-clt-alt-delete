-- Storage Setup for ReWear App
-- Run this in your Supabase SQL Editor

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'item-images' 
  AND auth.role() = 'authenticated'
);

-- Allow public access to view images
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (bucket_id = 'item-images');

-- Allow users to delete their own images
CREATE POLICY "Allow user deletion" ON storage.objects
FOR DELETE USING (
  bucket_id = 'item-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own images
CREATE POLICY "Allow user updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'item-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 