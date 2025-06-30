
-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profiles', 'profiles', true),
  ('images', 'images', true);

-- Create storage policies to allow public access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);

-- Insert initial personal info record (if none exists)
INSERT INTO personal_info (name, title, bio, profile_image_url)
SELECT 'يزن صالح', 'خبير إدارة المنتجات', 'مرحباً بكم في موقعي الشخصي', null
WHERE NOT EXISTS (SELECT 1 FROM personal_info);

-- Insert initial site settings record (if none exists)
INSERT INTO site_settings (site_name, site_description, contact_email, linkedin_url, twitter_url, medium_url)
SELECT 'يزن صالح', 'موقع شخصي لمشاركة المقالات ورحلات الشركات', 'contact@example.com', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
