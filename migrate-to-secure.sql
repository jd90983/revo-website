-- ============================================
-- Migration Script: Add Security Features to Existing Table
-- ============================================
-- Run this AFTER you've already created the basic leads table
-- This adds security features without breaking existing data
-- ============================================

-- ============================================
-- STEP 1: Add Missing Columns (Safe - Won't Break Existing Data)
-- ============================================

-- Add deleted_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE leads ADD COLUMN deleted_at TIMESTAMP;
    RAISE NOTICE 'Added deleted_at column';
  ELSE
    RAISE NOTICE 'deleted_at column already exists';
  END IF;
END $$;

-- Add ip_address column if it doesn't exist (optional)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE leads ADD COLUMN ip_address INET;
    RAISE NOTICE 'Added ip_address column';
  ELSE
    RAISE NOTICE 'ip_address column already exists';
  END IF;
END $$;

-- Add user_agent column if it doesn't exist (optional)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE leads ADD COLUMN user_agent TEXT;
    RAISE NOTICE 'Added user_agent column';
  ELSE
    RAISE NOTICE 'user_agent column already exists';
  END IF;
END $$;

-- ============================================
-- STEP 2: Create Duplicate Prevention Index
-- ============================================

-- Drop index if it exists (to recreate with correct definition)
DROP INDEX IF EXISTS idx_leads_duplicate_prevention;

-- Create unique index to prevent exact duplicates within 1 hour
CREATE UNIQUE INDEX idx_leads_duplicate_prevention 
ON leads (
  email, 
  contact_number, 
  industry, 
  calls_per_week, 
  DATE_TRUNC('hour', submitted_at)
) 
WHERE deleted_at IS NULL;

-- ============================================
-- STEP 3: Update RLS Policies
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;

-- Policy 1: Anonymous users can ONLY insert (no read/update/delete)
CREATE POLICY "Allow anonymous form submissions"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Additional security checks
    LENGTH(TRIM(first_name)) >= 1 AND
    LENGTH(TRIM(last_name)) >= 1 AND
    LENGTH(TRIM(email)) >= 5 AND
    -- Prevent spam: max 5 submissions per email per day
    (
      SELECT COUNT(*) 
      FROM leads 
      WHERE email = NEW.email 
        AND submitted_at > NOW() - INTERVAL '24 hours'
        AND deleted_at IS NULL
    ) < 5 AND
    -- Prevent exact duplicates: same email + phone + industry + calls within 1 hour
    NOT EXISTS (
      SELECT 1 
      FROM leads 
      WHERE email = NEW.email 
        AND contact_number = NEW.contact_number
        AND industry = NEW.industry
        AND calls_per_week = NEW.calls_per_week
        AND submitted_at > NOW() - INTERVAL '1 hour'
        AND deleted_at IS NULL
    )
  );

-- Policy 2: Authenticated users can read non-deleted leads
CREATE POLICY "Authenticated users can read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Policy 3: Authenticated users can update non-deleted leads
CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (deleted_at IS NULL);

-- ============================================
-- STEP 4: Verify Everything Works
-- ============================================

-- Check if columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN ('deleted_at', 'ip_address', 'user_agent')
ORDER BY column_name;

-- Check if index was created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'leads' 
  AND indexname = 'idx_leads_duplicate_prevention';

-- Check if policies exist
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Duplicate prevention is now active.';
  RAISE NOTICE 'RLS policies have been updated.';
END $$;
