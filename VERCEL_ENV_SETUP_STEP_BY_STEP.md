# Step-by-Step: Add Environment Variables to Vercel

## ⚠️ Important: Vercel Doesn't Use .env Files

Vercel doesn't support uploading `.env` files directly. You need to add environment variables through their dashboard. The `.env` file I created is just for **reference** - use it to copy the values.

## Step-by-Step Instructions:

### Step 1: Open Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Sign in if needed
3. Click on your **revo-website** project

### Step 2: Navigate to Environment Variables
1. Click **Settings** (top menu bar)
2. Click **Environment Variables** (left sidebar, under "Configuration")

### Step 3: Add First Variable (SUPABASE_URL)
1. Click **Add New** button
2. In the form that appears:
   - **Key:** `SUPABASE_URL`
   - **Value:** `https://vhlqlwlpjvlpbbqhzcvs.supabase.co`
   - **Environment:** Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### Step 4: Add Second Variable (SUPABASE_ANON_KEY)
1. Click **Add New** button again
2. In the form:
   - **Key:** `SUPABASE_ANON_KEY`
   - **Value:** `sb_publishable_jwDRjqiugDIB6eGOkKodnw_0HAr73JA`
   - **Environment:** Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### Step 5: Verify Variables Are Added
You should now see two variables listed:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### Step 6: Redeploy (CRITICAL!)
**Environment variables only apply to NEW deployments!**

1. Go to **Deployments** tab (top menu)
2. Find the latest deployment
3. Click the **...** (three dots) menu on the right
4. Click **Redeploy**
5. Select **Use existing Build Cache** (optional, but faster)
6. Click **Redeploy**
7. Wait for deployment to finish (usually 1-2 minutes)

### Step 7: Test the Form
1. Go to your website: https://www.revoapp.ai
2. Fill out the "Get Started" form
3. Submit it
4. Check Supabase Dashboard → Table Editor → leads table
5. You should see your submission!

## Troubleshooting

### Still Getting "Server configuration error"?
- ✅ Did you add BOTH variables?
- ✅ Did you select all three environments (Production, Preview, Development)?
- ✅ Did you click "Save" after adding each variable?
- ✅ Did you redeploy after adding the variables?
- ✅ Did you wait for the deployment to finish?

### Variable Names Must Be Exact
- `SUPABASE_URL` (not `supabase_url` or `SUPABASE-URL`)
- `SUPABASE_ANON_KEY` (not `SUPABASE_ANON` or `SUPABASE_KEY`)

### Check Your Supabase Anon Key
If the key doesn't work, get the correct one:
1. Go to Supabase Dashboard
2. Settings → API
3. Copy the `anon` `public` key (should start with `eyJ`)
4. Update the variable in Vercel with the correct key

## Visual Guide

```
Vercel Dashboard
├── Your Project (revo-website)
    ├── Settings
    │   ├── Environment Variables ← Click here
    │   │   ├── Add New
    │   │   │   ├── Key: SUPABASE_URL
    │   │   │   ├── Value: https://vhlqlwlpjvlpbbqhzcvs.supabase.co
    │   │   │   └── Environment: ✅ Production ✅ Preview ✅ Development
    │   │   └── Save
    │   │
    │   │   ├── Add New (again)
    │   │   │   ├── Key: SUPABASE_ANON_KEY
    │   │   │   ├── Value: sb_publishable_jwDRjqiugDIB6eGOkKodnw_0HAr73JA
    │   │   │   └── Environment: ✅ Production ✅ Preview ✅ Development
    │   │   └── Save
    │   │
    │   └── Then go to Deployments → Redeploy
```

## That's It!

Once you've added the variables and redeployed, your form should work perfectly! 🎉
