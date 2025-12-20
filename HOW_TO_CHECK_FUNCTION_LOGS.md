# How to Check Vercel Function Logs for Errors

## Step-by-Step Instructions

### Option 1: From Deployment Page (Easiest)

1. **On the deployment page you're currently viewing:**
   - Look for a section called **"Runtime Logs"** or **"Functions"**
   - You mentioned seeing "Runtime Logs" - click on that!

2. **Or look for a tab/section that says:**
   - "Functions"
   - "Function Logs"
   - "Runtime"
   - "Logs"

3. **Click on `/api/submit-form`** in the functions list

4. **You'll see logs** - these show what happens when the API runs

### Option 2: From Project Overview

1. Go to your **Project** page (not the deployment)
2. Click **Functions** in the left sidebar
3. Click on `/api/submit-form`
4. You'll see all the function invocations and their logs

### Option 3: Real-Time Logs

1. **Keep the Runtime Logs page open**
2. **Go to your website** in another tab
3. **Submit the form**
4. **Watch the logs appear in real-time** - you'll see the error immediately!

## What You're Looking For

When you submit the form, you should see logs like:

```
[timestamp] POST /api/submit-form
[timestamp] Form submission error: [ERROR MESSAGE HERE]
[timestamp] Error details: {...}
```

The error message will tell us exactly what's wrong:
- "Missing Supabase credentials" → Environment variables
- "permission denied" → RLS policy issue
- "relation 'leads' does not exist" → Table issue
- Any other specific error

## If You Can't Find Function Logs

1. Try clicking **"Runtime Logs"** link you mentioned
2. Or go to: Vercel Dashboard → Your Project → **Functions** (left sidebar)
3. Or check **Observability** section

## Quick Test

1. Open Runtime Logs (or Functions page)
2. Keep it open
3. Submit the form on your website
4. Watch the logs - the error will appear!

The logs will show the EXACT error message that's causing the 500 error.
