# ReWear Setup Guide

This guide will help you set up the ReWear platform on your local machine.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd rewear-app

# Install dependencies
npm install
```

## Step 2: Set up Supabase

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login and create a new project
   - Wait for the project to be ready

2. **Get your credentials**
   - Go to Settings > API
   - Copy your Project URL and anon public key

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 3: Database Setup

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Run the database setup script**
   - Copy the contents of `database-setup.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the script

3. **Verify tables are created**
   - Go to "Table Editor" in the left sidebar
   - You should see `profiles`, `items`, and `swaps` tables

## Step 4: Configure Authentication

1. **Set up email authentication**
   - Go to Authentication > Settings in Supabase
   - Enable "Email" provider
   - Configure any additional settings as needed

2. **Set up Row Level Security (RLS)**
   - The RLS policies are already included in the database setup script
   - Verify they're working by checking the "Policies" tab for each table

## Step 5: Run the Application

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test the Application

1. **Create an account**
   - Go to the signup page
   - Create a new user account

2. **Test admin access**
   - Create an account with an email containing "admin" (e.g., "admin@test.com")
   - This will give you access to the admin panel

3. **Add some test items**
   - Use the "List Item" feature to add some clothing items
   - Test the image upload (currently uses local URLs for demo)

## Troubleshooting

### Common Issues

1. **Environment variables not working**
   - Make sure `.env.local` is in the root directory
   - Restart the development server after adding environment variables

2. **Database connection errors**
   - Verify your Supabase URL and key are correct
   - Check that the database setup script ran successfully

3. **Authentication issues**
   - Ensure email authentication is enabled in Supabase
   - Check that RLS policies are properly configured

4. **Image upload not working**
   - The current implementation uses local URLs for demo purposes
   - For production, you'll need to set up Supabase Storage

### Getting Help

- Check the browser console for error messages
- Verify all environment variables are set correctly
- Ensure the database tables and policies are created properly

## Production Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in the Vercel dashboard
   - Deploy

### Environment Variables for Production

Make sure to set these in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Next Steps

- Set up Supabase Storage for image uploads
- Configure email templates for authentication
- Set up monitoring and analytics
- Customize the design and branding
- Add additional features as needed

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the main README.md file
3. Create an issue in the GitHub repository
4. Contact the development team

---

**Happy coding! 🚀** 