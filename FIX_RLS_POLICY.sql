-- ============================================
-- Fix RLS Policy for Anonymous Form Submissions
-- ============================================
-- Run this in Supabase SQL Editor to fix the RLS error

-- First, check if the policy exists
SELECT * FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow anonymous form submissions';

-- If the policy doesn't exist or isn't working, run this:

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

-- Test the policy by trying to insert (this should work now)
-- Note: Run this as anon role, or it will use your authenticated role
-- The API will use the anon role automatically
