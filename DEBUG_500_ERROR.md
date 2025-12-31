# Debugging the 500 Internal Server Error

## Current Status
✅ Environment variables are set in Vercel
✅ The `leads` table exists in Supabase
❌ Form submission returns 500 error

## Step 1: Check Vercel Function Logs

This will show you the EXACT error:

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on your **revo-website** project
3. Go to **Deployments** tab
4. Click on the **latest deployment**
5. Click **Functions** tab (or look for "Functions" in the sidebar)
6. Click on `/api/submit-form`
7. You'll see **Function Logs** - look for red error messages

**What to look for:**
- "Missing Supabase credentials" → Environment variables not set correctly
- "relation 'leads' does not exist" → Table doesn't exist (but we know it does)
- "permission denied" → RLS policy issue
- "invalid input syntax" → Data format issue
- Any other error message

## Step 2: Verify Environment Variables

Even though they're set, let's double-check:

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify both variables exist:
   - `SUPABASE_URL` = `https://vhlqlwlpjvlpbbqhzcvs.supabase.co`
   - `SUPABASE_ANON_KEY` = (should start with `eyJ` or `sb_publishable_`)
3. Make sure they're enabled for **Production** environment
4. **Important:** After checking, redeploy if you made any changes

## Step 3: Verify Supabase Anon Key

Your anon key starts with `sb_publishable_` which is unusual. Supabase anon keys are usually JWT tokens starting with `eyJ`.

**To get the correct key:**
1. Go to Supabase Dashboard
2. Click **Settings** (gear icon, bottom left)
3. Click **API** (under Project Settings)
4. Under **Project API keys**, find the `anon` `public` key
5. Copy it (should start with `eyJ`)
6. Update it in Vercel if different

## Step 4: Check RLS Policies

The table exists, but RLS might be blocking inserts:

1. In Supabase Dashboard → **Table Editor** → `leads` table
2. Click **RLS policies** button (top right, shows "3" badge)
3. Verify you have a policy that allows **INSERT** for **anon** role
4. The policy should be named something like "Allow anonymous form submissions"

**If the policy doesn't exist or is wrong:**
- Go to **SQL Editor**
- Run this to check policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

**To fix RLS (if needed):**
```sql
-- Allow anonymous inserts
CREATE POLICY "Allow anonymous form submissions"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

## Step 5: Test Supabase Connection Directly

Test if the API can connect to Supabase:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this test query:
```sql
-- Test if we can insert (this simulates what the API does)
INSERT INTO leads (first_name, last_name, email, contact_number, industry, calls_per_week)
VALUES ('Test', 'User', 'test@example.com', '1234567890', 'hvac', '10-20')
RETURNING *;
```

If this works, the issue is with the API code or environment variables.
If this fails, there's a database/RLS issue.

## Step 6: Check API Route Code

The most recent fix I made should help, but let's verify:

1. Make sure you've pushed the latest code
2. Check that `api/submit-form.js` has the error handling improvements
3. The logs should now show more detailed error messages

## Most Likely Causes:

1. **Wrong anon key format** → Get the correct `eyJ` key from Supabase
2. **RLS policy blocking inserts** → Check policies allow `anon` role to INSERT
3. **Environment variables not applied** → Redeploy after setting variables
4. **Code error** → Check Vercel function logs for specific error

## Quick Test:

After checking the Vercel logs, try submitting the form again and check:
1. What error appears in Vercel function logs?
2. What error appears in browser console?
3. Does the Supabase test insert work?

Share the Vercel function log error message and I can help fix it!
