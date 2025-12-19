# Supabase Setup Guide for Revo Website

## Step 1: Set Up Database Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-setup.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

This creates:
- `leads` table to store all form submissions
- Indexes for fast queries
- Security policies (RLS)
- Auto-update timestamp function

## Step 2: Get Your Supabase Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: `https://vhlqlwlpjvlpbbqhzcvs.supabase.co` ✅ (you already have this)
   - **anon/public key**: This is your publishable key ✅ (you already have this)
   - **service_role key**: Keep this SECRET (only for server-side use)

## Step 3: Set Up Vercel Environment Variables

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project (revo-website)
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

### Required Variables:

```
SUPABASE_URL = https://vhlqlwlpjvlpbbqhzcvs.supabase.co
SUPABASE_ANON_KEY = sb_publishable_jwDRjqiugDIB6eGOkKodnw_0HAr73JA
```

### Optional (for email notifications):

```
RESEND_API_KEY = re_xxxxxxxxxxxxx (get from resend.com)
SALES_EMAIL = sales@revoapp.ai (your sales team email)
```

5. Make sure to add these for **Production**, **Preview**, and **Development** environments
6. Click **Save**

## Step 4: Install Supabase Package (for API route)

The API route needs the Supabase JavaScript client. Create `package.json`:

```json
{
  "name": "revo-website",
  "version": "1.0.0",
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

Then in Vercel, the package will be auto-installed, OR you can run locally:
```bash
npm install
```

## Step 5: Deploy to Vercel

1. Push your code to GitHub (if not already)
2. Vercel will automatically detect the changes
3. The API route at `/api/submit-form.js` will be deployed as a serverless function
4. Test the form on your live site

## Step 6: Test the Form

1. Go to your website
2. Fill out the "Get Started" form
3. Submit it
4. Check Supabase Dashboard → **Table Editor** → **leads** table
5. You should see the new submission!

## Step 7: View Your Leads

### Option A: Supabase Dashboard (Easiest)

1. Go to Supabase Dashboard
2. Click **Table Editor** (left sidebar)
3. Select **leads** table
4. View all submissions in a spreadsheet-like interface
5. You can:
   - Filter by status, industry, date
   - Search by name or email
   - Edit status and notes
   - Export to CSV

### Option B: Create Admin Panel (Future)

We can build a custom admin panel later if needed.

## Troubleshooting

### Form submissions not saving?

1. Check Vercel Function Logs:
   - Vercel Dashboard → Your Project → **Functions** tab
   - Click on `/api/submit-form`
   - Check for errors

2. Check Supabase Logs:
   - Supabase Dashboard → **Logs** → **API Logs**
   - Look for errors

3. Verify Environment Variables:
   - Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in Vercel
   - Redeploy after adding environment variables

### Email notifications not working?

- Email is optional - leads are still saved to database
- To enable emails, sign up for Resend (free tier: 3,000 emails/month)
- Add `RESEND_API_KEY` to Vercel environment variables

## Security Notes

✅ **Safe to expose:**
- `SUPABASE_URL` (public)
- `SUPABASE_ANON_KEY` (public, protected by RLS policies)

❌ **Never expose:**
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret, server-side only)

The Row Level Security (RLS) policies we set up ensure:
- Anyone can submit forms (anon users)
- Only authenticated users can read/update leads (for admin panel)

## Next Steps

1. ✅ Database is set up
2. ✅ API route is created
3. ✅ Frontend is updated
4. ⏳ Set environment variables in Vercel
5. ⏳ Deploy and test
6. ⏳ (Optional) Set up email notifications with Resend

## Viewing Leads in Supabase

Once you have submissions, you can:

1. **View in Table Editor:**
   - Supabase Dashboard → Table Editor → leads
   - See all submissions in a table

2. **Query with SQL:**
   ```sql
   -- Get all new leads
   SELECT * FROM leads WHERE status = 'new' ORDER BY submitted_at DESC;
   
   -- Get leads by industry
   SELECT * FROM leads WHERE industry = 'hvac' ORDER BY submitted_at DESC;
   
   -- Get today's leads
   SELECT * FROM leads WHERE DATE(submitted_at) = CURRENT_DATE;
   ```

3. **Export Data:**
   - Table Editor → Click "..." menu → Export CSV

## Need Help?

If you encounter any issues:
1. Check Vercel function logs
2. Check Supabase logs
3. Verify environment variables are set correctly
4. Make sure the database table was created successfully
