# ⚠️ QUICK FIX: Set Environment Variables in Vercel

## The Error You're Seeing
"Server configuration error" = Missing environment variables in Vercel

## Fix This Now (5 minutes):

### Step 1: Go to Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Click on your **revo-website** project

### Step 2: Add Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Add these TWO variables:

#### Variable 1:
- **Name:** `SUPABASE_URL`
- **Value:** `https://vhlqlwlpjvlpbbqhzcvs.supabase.co`
- **Environment:** Select all three:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
- Click **Save**

#### Variable 2:
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** `sb_publishable_jwDRjqiugDIB6eGOkKodnw_0HAr73JA`
- **Environment:** Select all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click **Save**

### Step 3: Redeploy
**IMPORTANT:** After adding variables, you MUST redeploy:

1. Go to **Deployments** tab
2. Click the **...** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to finish

### Step 4: Test Again
1. Go to your website
2. Fill out the form
3. Submit it
4. Check Supabase → Table Editor → leads table

## ⚠️ Important Notes:

1. **The anon key you provided might be wrong format**
   - Supabase anon keys usually start with `eyJ` (they're JWT tokens)
   - Your key starts with `sb_publishable_` which is unusual
   - **To get the correct key:**
     - Go to Supabase Dashboard
     - Settings → API
     - Copy the `anon` `public` key (should start with `eyJ`)

2. **After adding variables, ALWAYS redeploy**
   - Environment variables only apply to NEW deployments
   - Old deployments don't have the variables

3. **Verify variables are set:**
   - In Vercel Dashboard → Settings → Environment Variables
   - You should see both `SUPABASE_URL` and `SUPABASE_ANON_KEY` listed

## Still Getting Errors?

If you still get "Server configuration error" after:
1. ✅ Adding both environment variables
2. ✅ Redeploying
3. ✅ Waiting for deployment to finish

Then check:
- Are the variable names EXACTLY: `SUPABASE_URL` and `SUPABASE_ANON_KEY`? (case-sensitive)
- Did you select all three environments (Production, Preview, Development)?
- Did you click "Save" after adding each variable?
- Did you redeploy after adding the variables?

## Next Steps After This Works:

1. ✅ Form submissions will save to Supabase
2. ✅ View leads in Supabase Dashboard → Table Editor
3. ⏳ (Optional) Set up email notifications with Resend
