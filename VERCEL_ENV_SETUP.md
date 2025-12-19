# Vercel Environment Variables Setup

## Quick Setup Steps

1. Go to: https://vercel.com/dashboard
2. Select your **revo-website** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

## Required Environment Variables

### 1. Supabase Configuration

```
Variable Name: SUPABASE_URL
Value: https://vhlqlwlpjvlpbbqhzcvs.supabase.co
Environment: Production, Preview, Development
```

```
Variable Name: SUPABASE_ANON_KEY
Value: sb_publishable_jwDRjqiugDIB6eGOkKodnw_0HAr73JA
Environment: Production, Preview, Development
```

**Note:** If the anon key doesn't work, get the correct one from:
- Supabase Dashboard → Settings → API → Project API keys → `anon` `public` key

## Optional: Email Notifications

If you want email notifications when forms are submitted:

### 2. Resend Email Service (Recommended)

1. Sign up at: https://resend.com (free: 3,000 emails/month)
2. Get your API key
3. Add to Vercel:

```
Variable Name: RESEND_API_KEY
Value: re_xxxxxxxxxxxxx (your Resend API key)
Environment: Production, Preview, Development
```

```
Variable Name: SALES_EMAIL
Value: sales@revoapp.ai (your sales team email)
Environment: Production, Preview, Development
```

## After Adding Variables

1. **Redeploy** your site in Vercel:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Click **Redeploy**

OR

2. Push a new commit to trigger automatic deployment

## Verify Setup

1. Fill out the form on your website
2. Check Supabase Dashboard → **Table Editor** → **leads** table
3. You should see the new submission!

## Troubleshooting

### "Missing Supabase credentials" error?

- Make sure environment variables are set in Vercel
- Redeploy after adding variables
- Check variable names are exact: `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### Form works but no data in Supabase?

- Check Supabase SQL Editor ran successfully
- Verify the `leads` table exists
- Check Supabase Dashboard → Logs for errors

### Need to get correct Supabase keys?

1. Go to Supabase Dashboard
2. Settings → API
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY` (starts with `eyJ`)
