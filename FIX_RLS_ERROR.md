# Fix RLS Policy Error - Step by Step

## The Error
```
new row violates row-level security policy for table "leads"
Code: 42501
```

This means the RLS policy isn't allowing anonymous users to insert data.

## Quick Fix (5 minutes)

### Step 1: Go to Supabase SQL Editor
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `revo_ai_webpage`
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Check Current Policies
First, let's see what policies exist:

```sql
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

This will show you all policies on the `leads` table.

### Step 3: Fix the Policy
Copy and paste this entire SQL into the SQL Editor:

```sql
-- Drop the existing policy if it exists (to recreate it)
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON leads;

-- Create the policy that allows anonymous users to insert
CREATE POLICY "Allow anonymous form submissions"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

### Step 4: Run the SQL
1. Click **Run** (or press Cmd/Ctrl + Enter)
2. You should see "Success" and the policy list

### Step 5: Test the Form
1. Go to your website: https://www.revoapp.ai
2. Fill out the form
3. Submit it
4. Check Supabase → Table Editor → leads table
5. You should see your submission! 🎉

## Why This Happened

The RLS policy either:
- Wasn't created when you ran the original SQL
- Was created incorrectly
- Got deleted or modified

This fix recreates it correctly.

## Verify It Worked

After running the SQL, check:
1. The policy appears in the list (from the SELECT query)
2. The form submission works
3. Data appears in the `leads` table

## Still Not Working?

If you still get the error:
1. Make sure RLS is enabled: `ALTER TABLE leads ENABLE ROW LEVEL SECURITY;`
2. Check the policy exists: `SELECT * FROM pg_policies WHERE tablename = 'leads';`
3. Verify the policy is for `anon` role and `INSERT` operation

The fix SQL above should resolve it!
