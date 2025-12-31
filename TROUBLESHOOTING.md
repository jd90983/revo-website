# Troubleshooting: Form Not Saving to Supabase

## Issue: Form submits but no data in Supabase

### Step 1: Check if Database Table Exists

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Click **Table Editor** (left sidebar)
3. Do you see a table called **leads**?
   - ✅ **YES** → Go to Step 2
   - ❌ **NO** → You need to run the SQL first (see below)

**If table doesn't exist:**
1. Go to **SQL Editor** → **New Query**
2. Open `supabase-setup.sql` from your project
3. Copy ALL the SQL code
4. Paste into Supabase SQL Editor
5. Click **Run**
6. Go back to **Table Editor** - you should now see the `leads` table

### Step 2: Check Browser Console for Errors

1. Open your website (localhost or live site)
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Submit the form
5. Look for any **red errors**

**Common errors:**
- `Failed to fetch` → API endpoint issue
- `CORS error` → Cross-origin issue
- `404 Not Found` → API route not found
- `500 Internal Server Error` → Server-side error

### Step 3: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Submit the form
3. Look for a request to `/api/submit-form` or `revoapp.ai/api/submit-form`
4. Click on it to see:
   - **Status Code**: Should be 200 (success) or 400/500 (error)
   - **Response**: What the server returned

### Step 4: Check Vercel Function Logs

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click **Functions** tab
6. Click on `/api/submit-form`
7. Check the logs for errors

**Common errors in logs:**
- `Missing Supabase credentials` → Environment variables not set
- `relation 'leads' does not exist` → Database table not created
- `permission denied` → RLS policy issue

### Step 5: Verify Environment Variables

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Make sure these are set:
   - `SUPABASE_URL` = `https://vhlqlwlpjvlpbbqhzcvs.supabase.co`
   - `SUPABASE_ANON_KEY` = (your anon key)
3. Make sure they're enabled for **Production** environment
4. **Redeploy** after adding/changing variables

### Step 6: Test Database Connection

Run this in Supabase SQL Editor:

```sql
-- Test if you can insert data
INSERT INTO leads (first_name, last_name, email, contact_number, industry, calls_per_week)
VALUES ('Test', 'User', 'test@example.com', '1234567890', 'hvac', '10-20');

-- Check if it was inserted
SELECT * FROM leads WHERE email = 'test@example.com';

-- Delete test record
DELETE FROM leads WHERE email = 'test@example.com';
```

If this works, your database is set up correctly.

## Quick Checklist

- [ ] Database table `leads` exists in Supabase
- [ ] Environment variables set in Vercel (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- [ ] Site redeployed after setting environment variables
- [ ] No errors in browser console
- [ ] No errors in Vercel function logs
- [ ] API endpoint returns 200 status (check Network tab)

## Testing on Localhost

**Important:** The API route only works when deployed to Vercel. 

For localhost testing, the form now automatically uses your deployed API at `https://revoapp.ai/api/submit-form`.

**To test locally:**
1. Make sure your site is deployed to Vercel
2. The form will automatically use the deployed API
3. Submit the form
4. Check Supabase to see if data was saved

## Still Not Working?

1. **Check Supabase Logs:**
   - Supabase Dashboard → **Logs** → **API Logs**
   - Look for any errors when form is submitted

2. **Verify Anon Key:**
   - Supabase Dashboard → **Settings** → **API**
   - Copy the `anon` `public` key (should start with `eyJ`)
   - Make sure it matches what's in Vercel environment variables

3. **Test API Directly:**
   ```bash
   curl -X POST https://revoapp.ai/api/submit-form \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "contactNumber": "1234567890",
       "industry": "hvac",
       "callsPerWeek": "10-20"
     }'
   ```

If this returns an error, check the error message for clues.
