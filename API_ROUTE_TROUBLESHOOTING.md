# API Route 404 Error - Troubleshooting

## The Problem
The API route `/api/submit-form` is returning a 404 error, meaning Vercel isn't recognizing it as a serverless function.

## Possible Causes & Solutions

### 1. Check Vercel Deployment Logs
1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Check the **Build Logs** for any errors
4. Look for messages about API routes or serverless functions

### 2. Verify API Route File Structure
The file should be at: `/api/submit-form.js`

Vercel automatically detects files in the `/api` folder as serverless functions.

### 3. Check if Package.json is Deployed
Make sure `package.json` is in your repository and deployed. Vercel needs it to install the `@supabase/supabase-js` dependency.

### 4. Verify Environment Variables
Make sure these are set in Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 5. Try Renaming the File
Sometimes Vercel has issues with certain file names. Try:
- Rename `api/submit-form.js` to `api/submitForm.js` (camelCase)
- Update the frontend to use the new name

### 6. Check Vercel Project Settings
1. Vercel Dashboard → Your Project → Settings
2. Go to **Functions** section
3. Make sure **Serverless Functions** are enabled
4. Check the Node.js version (should be 18.x or higher)

### 7. Manual Test
Try accessing the API directly:
```
https://www.revoapp.ai/api/submit-form
```

If you get a 404, the route isn't deployed. If you get a method not allowed, it's working but needs POST.

## Quick Fix: Remove vercel.json

I've set `vercel.json` to `{}` (empty) to let Vercel auto-detect everything. This should work, but if it doesn't:

1. Delete `vercel.json` entirely
2. Redeploy
3. Vercel will auto-detect:
   - Static files (HTML, CSS, JS)
   - API routes in `/api` folder

## Alternative: Use Vercel CLI to Test Locally

```bash
npm install -g vercel
vercel dev
```

This will run your site locally with API routes working, so you can test before deploying.

## Still Not Working?

If none of these work, we might need to:
1. Check Vercel build logs for specific errors
2. Verify the API route export format
3. Consider using a different API route structure
