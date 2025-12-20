-- ============================================
-- ADD COUNTRY/GEO COLUMNS TO LEADS TABLE
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Add country_code column (e.g., "US", "MX", "GB")
ALTER TABLE leads ADD COLUMN IF NOT EXISTS country_code VARCHAR(10);

-- Add country_name column (e.g., "United States", "Mexico")
ALTER TABLE leads ADD COLUMN IF NOT EXISTS country_name VARCHAR(100);

-- Add city column (e.g., "Los Angeles", "Mexico City")
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city VARCHAR(255);

-- Add region column (e.g., "CA", "CDMX")
ALTER TABLE leads ADD COLUMN IF NOT EXISTS region VARCHAR(100);

-- Create index for country-based queries
CREATE INDEX IF NOT EXISTS idx_leads_country ON leads(country_code);

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN ('country_code', 'country_name', 'city', 'region')
ORDER BY column_name;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SUCCESS! Country columns added to leads table.';
END $$;
