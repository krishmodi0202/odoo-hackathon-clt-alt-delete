# Supabase Setup Guide for ReWear

## Step 1: Create Environment File

Create a `.env.local` file in your project root with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ohrmkrbzjkowqvsybfkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocm1rcmJ6amtvd3F2c3liZmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTQxNTYsImV4cCI6MjA2Nzg3MDE1Nn0.LIVLf2PofVDnn7fwLWLBr3S0jBI0e5hBJARHgqCCRKk

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Set Up Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `ohrmkrbzjkowqvsybfkb`
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire content from `database-setup.sql`
6. Click **Run** to execute the script

## Step 3: Set Up Storage

1. In the same SQL Editor, create another **New Query**
2. Copy and paste the entire content from `storage-setup.sql`
3. Click **Run** to execute the script

## Step 4: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `profiles`
   - `items`
   - `swaps`

3. Go to **Storage** in the left sidebar
4. You should see a bucket called `item-images`

## Step 5: Test the Connection

Run your development server:

```bash
npm run dev
```

The app should now connect to Supabase successfully!

## Troubleshooting

### If you get connection errors:
1. Check that your `.env.local` file exists and has the correct credentials
2. Make sure you've run both SQL scripts in Supabase
3. Restart your development server after creating the `.env.local` file

### If tables don't appear:
1. Check the SQL Editor for any error messages
2. Make sure you're in the correct project
3. Try running the scripts one section at a time

### If storage doesn't work:
1. Verify the storage bucket was created
2. Check that the storage policies were applied
3. Make sure you're authenticated when testing uploads

## Next Steps

Once Supabase is set up, you can:
1. Start building the authentication system
2. Create the landing page
3. Implement item management features
4. Add the swap system

Your database is now ready for the ReWear application! 🎉 