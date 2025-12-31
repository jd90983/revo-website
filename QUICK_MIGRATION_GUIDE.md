# Quick Migration Guide - Fix "deleted_at does not exist" Error

## The Problem

You're getting this error:
```
ERROR: 42703: column "deleted_at" does not exist
```

This happens because the secure SQL script assumes the table already has the `deleted_at` column, but your existing table doesn't have it yet.

## Quick Fix (2 Steps)

### Step 1: Add Missing Columns

Run this SQL first to add the missing columns:

```sql
-- Add deleted_at column
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Add optional columns (for security monitoring)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_agent TEXT;
```

### Step 2: Run the Migration Script

Now run the complete `migrate-to-secure.sql` file, which will:
- ✅ Add missing columns safely
- ✅ Create duplicate prevention index
- ✅ Update RLS policies
- ✅ Verify everything works

## Or Use the Complete Migration Script

I've created `migrate-to-secure.sql` which does everything automatically:

1. **Go to Supabase SQL Editor**
2. **Open `migrate-to-secure.sql`**
3. **Copy and paste the entire file**
4. **Click Run**

This script:
- ✅ Checks if columns exist before adding them
- ✅ Safely adds `deleted_at`, `ip_address`, `user_agent`
- ✅ Creates the duplicate prevention index
- ✅ Updates RLS policies with duplicate prevention
- ✅ Verifies everything was created correctly

## What Gets Added

### New Columns
- `deleted_at` - For soft delete (allows data recovery)
- `ip_address` - For security monitoring (optional)
- `user_agent` - For security monitoring (optional)

### New Index
- `idx_leads_duplicate_prevention` - Prevents exact duplicates within 1 hour

### Updated Policies
- RLS policy now includes duplicate prevention check
- Still allows anonymous inserts
- Still prevents spam (5 per email per day)

## After Migration

1. ✅ Test form submission - should work normally
2. ✅ Test duplicate prevention - submit same form twice quickly
3. ✅ Check Supabase → Table Editor → leads - should see `deleted_at` column

## If You Still Get Errors

### Error: "column already exists"
- This is fine! The script checks and skips if column exists
- Just continue

### Error: "index already exists"
- Drop it first: `DROP INDEX IF EXISTS idx_leads_duplicate_prevention;`
- Then run the migration script again

### Error: "policy already exists"
- The script drops old policies first, so this shouldn't happen
- If it does, manually drop: `DROP POLICY IF EXISTS "policy_name" ON leads;`

## Verification

After running the migration, verify it worked:

```sql
-- Check columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN ('deleted_at', 'ip_address', 'user_agent');

-- Check index exists
SELECT indexname FROM pg_indexes 
WHERE tablename = 'leads' 
  AND indexname = 'idx_leads_duplicate_prevention';

-- Check policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'leads';
```

All three queries should return results if migration was successful!

## Next Steps

After migration:
1. ✅ Duplicate prevention is now active
2. ✅ Update your API route to use the secure version
3. ✅ Test form submissions
4. ✅ Verify duplicates are prevented

The migration is **safe** - it won't break existing data or functionality!
