
-- Add Instagram and Facebook URL columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN instagram_url TEXT,
ADD COLUMN facebook_url TEXT;

-- Remove medium_url column since it's no longer needed
ALTER TABLE site_settings 
DROP COLUMN IF EXISTS medium_url;
