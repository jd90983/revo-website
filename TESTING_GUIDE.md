# Testing Your Form Submission System

## ✅ Step 1: Verify Database Table Exists

Before testing, make sure you've run the SQL in Supabase:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor** (left sidebar)
4. You should see a **leads** table
5. If you don't see it, go to **SQL Editor** and run `supabase-setup.sql`

## ✅ Step 2: Test the Form

### Option A: Test on Localhost (Development)

1. Start your local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

2. Open: http://localhost:8000
3. Fill out the "Get Started" form
4. Submit it

### Option B: Test on Live Site

1. Go to your live site (revoapp.ai)
2. Fill out the "Get Started" form
3. Submit it

## ✅ Step 3: Verify Submission Saved

1. Go to Supabase Dashboard
2. Click **Table Editor** → **leads** table
3. You should see your test submission!
4. Check that all fields are populated correctly

## ✅ Step 4: Check for Errors

### If form doesn't work:

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Go to **Console** tab
   - Look for any red errors
   - Check **Network** tab for failed requests

2. **Check Vercel Function Logs:**
   - Vercel Dashboard → Your Project
   - Go to **Deployments** tab
   - Click on latest deployment
   - Click **Functions** tab
   - Click on `/api/submit-form`
   - Check for errors in logs

3. **Check Supabase Logs:**
   - Supabase Dashboard → **Logs** → **API Logs**
   - Look for any errors

## Common Issues & Fixes

### ❌ "Missing Supabase credentials" error

**Fix:**
- Verify environment variables in Vercel:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- Make sure they're set for **Production** environment
- Redeploy after adding variables

### ❌ "relation 'leads' does not exist"

**Fix:**
- You haven't run the SQL yet
- Go to Supabase → SQL Editor
- Run `supabase-setup.sql`

### ❌ Form submits but no data in Supabase

**Check:**
1. Supabase RLS policies are correct
2. Anon key has INSERT permission
3. Check Supabase logs for errors

### ❌ CORS error

**Fix:**
- The API route already handles CORS
- Make sure your domain is in the `allowedOrigins` array in `api/submit-form.js`
- If using a different domain, add it to the list

## Expected Behavior

✅ **Success:**
- Form shows: "Thank you! Your information has been received. We'll contact you soon."
- Data appears in Supabase `leads` table
- No errors in console

❌ **Failure:**
- Error message appears
- No data in Supabase
- Check logs for specific error

## Test Checklist

- [ ] Database table `leads` exists in Supabase
- [ ] Environment variables set in Vercel
- [ ] Site redeployed after adding variables
- [ ] Form submission works
- [ ] Data appears in Supabase table
- [ ] No errors in browser console
- [ ] No errors in Vercel function logs

## Next Steps After Testing

Once everything works:

1. ✅ Form submissions are being saved
2. ✅ You can view leads in Supabase Dashboard
3. ⏳ (Optional) Set up email notifications with Resend
4. ⏳ (Optional) Create admin panel for easier lead management

## Quick Test Query

To verify your setup, run this in Supabase SQL Editor:

```sql
-- Check if table exists
SELECT * FROM leads LIMIT 1;

-- Count total leads
SELECT COUNT(*) FROM leads;

-- View latest submissions
SELECT * FROM leads ORDER BY submitted_at DESC LIMIT 10;
```

If these queries work, your database is set up correctly! 🎉
