-- ============================================
-- EMERGENCY FIX: RLS Policy for Anonymous Inserts
-- ============================================
-- Run this in Supabase SQL Editor RIGHT NOW
-- ============================================

-- First, let's see what policies exist
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'leads';

-- Drop any existing insert policy (to recreate cleanly)
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON leads;
DROP POLICY IF EXISTS "allow_anon_insert" ON leads;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON leads;

-- Create the correct policy
CREATE POLICY "Allow anonymous form submissions"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);  -- Allow all inserts from anon role (validation done in API)

-- Verify it was created
SELECT policyname, cmd, roles, with_check
FROM pg_policies 
WHERE tablename = 'leads' AND cmd = 'INSERT';

-- Grant INSERT permission to anon role (just in case)
GRANT INSERT ON leads TO anon;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SUCCESS! RLS policy fixed. Anonymous users can now insert leads.';
END $$;
