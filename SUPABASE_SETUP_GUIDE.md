# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

## 2. Database Setup

Run the SQL commands from `database-setup.sql` in your Supabase SQL editor.

## 3. Storage Setup

### Create Storage Bucket

1. Go to your Supabase dashboard
2. Navigate to Storage in the sidebar
3. Click "Create a new bucket"
4. Name it `item-images`
5. Make it public (uncheck "Private bucket")
6. Click "Create bucket"

### Set Storage Policies

Run these SQL commands in your Supabase SQL editor:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public access to view images
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (bucket_id = 'item-images');

-- Allow users to delete their own images
CREATE POLICY "Allow user deletion" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## 4. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Or run `node create-env.js` to create it automatically.

## 5. Authentication Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:3000`)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`

## 6. Row Level Security (RLS)

Make sure RLS is enabled on your tables and the policies from `database-setup.sql` are applied.

## 7. Testing

1. Start your development server: `npm run dev`
2. Sign up for a new account
3. Try uploading an image when creating an item
4. Verify images are visible in the item details

## Troubleshooting

### Images not showing
- Check if the storage bucket `item-images` exists
- Verify storage policies are set correctly
- Check browser console for CORS errors

### Authentication issues
- Verify environment variables are set correctly
- Check Supabase authentication settings
- Ensure redirect URLs are configured

### Database errors
- Run the database setup SQL again
- Check RLS policies are enabled
- Verify table structure matches the schema 