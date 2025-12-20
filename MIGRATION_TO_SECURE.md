# Migration Guide: Upgrade to Secure Database

## Overview

This guide helps you migrate from the basic database setup to the enterprise-grade secure version.

## Pre-Migration Checklist

- [ ] Backup your current database (Supabase → Settings → Database → Backups)
- [ ] Test the migration on a staging environment first (if available)
- [ ] Review the security changes in `SECURITY_BEST_PRACTICES.md`
- [ ] Ensure you have admin access to Supabase

## Migration Steps

### Step 1: Review Current Data

```sql
-- Check current leads count
SELECT COUNT(*) FROM leads;

-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'leads';

-- Check current indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'leads';
```

### Step 2: Add New Columns (Non-Breaking)

```sql
-- Add new columns if they don't exist
ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS ip_address INET,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Add constraint for soft delete
-- (This is safe - won't affect existing data)
```

### Step 3: Create Audit Log Table

```sql
-- This creates a new table, safe to run
-- File: supabase-setup-secure.sql (lines 80-100)
-- Copy the CREATE TABLE leads_audit_log section
```

### Step 4: Update RLS Policies

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;

-- Create new secure policies
-- Copy from supabase-setup-secure.sql (lines 45-75)
```

### Step 5: Add Constraints (Careful - May Fail on Invalid Data)

```sql
-- First, check if any data violates constraints
SELECT * FROM leads 
WHERE LENGTH(TRIM(first_name)) < 1 
   OR LENGTH(TRIM(last_name)) < 1
   OR email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- If any rows found, clean them first, then add constraints
-- Copy CHECK constraints from supabase-setup-secure.sql
```

### Step 6: Create Audit Trigger

```sql
-- Copy audit function and trigger from supabase-setup-secure.sql
-- This is safe - just adds logging
```

### Step 7: Update API Route

```bash
# Backup current API route
cp api/submit-form.js api/submit-form.js.backup

# Replace with secure version
cp api/submit-form-secure.js api/submit-form.js
```

### Step 8: Test

1. Submit a test form
2. Verify data is saved
3. Check audit log is created
4. Test rate limiting
5. Test invalid inputs

### Step 9: Deploy

```bash
git add .
git commit -m "Upgrade to secure database schema and API"
git push origin main
```

## Rollback Plan

If something goes wrong:

### Rollback Database Changes

```sql
-- Disable audit trigger
DROP TRIGGER IF EXISTS trigger_audit_leads_changes ON leads;

-- Restore old policies (copy from original supabase-setup.sql)

-- Drop audit table (if needed)
DROP TABLE IF EXISTS leads_audit_log CASCADE;
```

### Rollback API Changes

```bash
# Restore backup
cp api/submit-form.js.backup api/submit-form.js
git add api/submit-form.js
git commit -m "Rollback to previous API version"
git push origin main
```

## Important Notes

### Breaking Changes
- **Rate Limiting:** Users can only submit 5 times per email per day (enforced in RLS)
- **Stricter Validation:** Some previously accepted data may now be rejected
- **Industry Whitelist:** Only specific industries are allowed

### Non-Breaking Changes
- Audit logging (adds new table, doesn't affect existing data)
- Soft delete (adds column, existing data unaffected)
- New indexes (performance improvement only)

### Data Migration

If you have existing data that doesn't meet new constraints:

```sql
-- Example: Fix invalid emails
UPDATE leads 
SET email = LOWER(TRIM(email))
WHERE email != LOWER(TRIM(email));

-- Example: Fix empty names
UPDATE leads 
SET first_name = 'Unknown'
WHERE LENGTH(TRIM(first_name)) < 1;
```

## Testing Checklist

After migration:
- [ ] Form submission works
- [ ] Rate limiting works (try 6 submissions)
- [ ] Invalid inputs are rejected
- [ ] Audit logs are created
- [ ] Existing data is still accessible
- [ ] RLS policies prevent unauthorized access
- [ ] Soft delete works
- [ ] Views work correctly

## Support

If you encounter issues:
1. Check Supabase logs
2. Check Vercel function logs
3. Review audit logs for errors
4. Verify RLS policies are correct

## Timeline

- **Preparation:** 15 minutes
- **Migration:** 10 minutes
- **Testing:** 15 minutes
- **Total:** ~40 minutes

## Post-Migration

1. Monitor error rates
2. Check audit logs daily
3. Run `detect_suspicious_activity()` weekly
4. Review security metrics monthly
