# Verify Your Supabase Anon Key

## The Issue

Your anon key starts with `sb_publishable_` which is unusual. Supabase anon keys are typically JWT tokens that start with `eyJ`.

## How to Get the Correct Key

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project: `revo_ai_webpage`

2. **Navigate to API Settings**
   - Click **Settings** (gear icon, bottom left sidebar)
   - Click **API** (under "Project Settings")

3. **Find the Anon Public Key**
   - Scroll to **Project API keys** section
   - Find the key labeled `anon` `public`
   - It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobHFsd2xwanZscGJicWh6Y3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1Njg5MTEsImV4cCI6MjA1MDE0NDkxMX0.xxxxxxxxxxxxx`
   - **It should start with `eyJ`** (this is a JWT token)

4. **Update in Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Edit `SUPABASE_ANON_KEY`
   - Replace with the correct `eyJ` key from Supabase
   - Save
   - **Redeploy** (important!)

## Why This Matters

The anon key is used to authenticate API requests to Supabase. If it's in the wrong format:
- Supabase won't recognize it
- API calls will fail
- You'll get 500 errors

## After Updating

1. ✅ Update the key in Vercel
2. ✅ Redeploy your site
3. ✅ Test the form again
4. ✅ Check Vercel function logs if it still fails

## Still Not Working?

If you've verified the key is correct and it still doesn't work:

1. **Check Vercel Function Logs** (most important!)
   - Vercel Dashboard → Deployments → Latest → Functions → `/api/submit-form`
   - Look for the actual error message
   - Share that error with me

2. **Test Supabase Connection**
   - Supabase Dashboard → SQL Editor
   - Run: `SELECT current_setting('request.jwt.claim.role', true);`
   - Should return `anon` or `authenticated`

3. **Verify RLS Policies**
   - Table Editor → `leads` table → RLS policies
   - Make sure "Allow anonymous form submissions" policy exists
   - Should allow INSERT for `anon` role

The Vercel function logs will tell us exactly what's wrong!
