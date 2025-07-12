-- Admin Setup for ReWear App
-- Run this in your Supabase SQL Editor

-- Option 1: Update existing user email to include 'admin'
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users 
SET email = 'admin.your-email@example.com'
WHERE email = 'your-email@example.com';

-- Option 2: Create a new admin user directly in the database
-- (This is for testing purposes only)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'admin@rewear.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
);

-- Option 3: Add admin role to profiles table
-- First, add an admin column to the profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Then update the admin access logic in the app to check this column
-- You would need to update the Navigation component to check profiles.is_admin instead of email

-- Grant admin access to a specific user (replace with actual user ID)
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-user-id-here';

-- View all admin users
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.is_admin,
  u.email as auth_email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true OR u.email LIKE '%admin%'; 