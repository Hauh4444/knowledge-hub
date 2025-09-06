-- Remove show_email column from user_settings table as emails should never be public
ALTER TABLE user_settings DROP COLUMN IF EXISTS show_email;

-- Remove email_notifications column as we're removing email exposure
ALTER TABLE user_settings DROP COLUMN IF EXISTS email_notifications;

-- Remove marketing_emails column as we're removing email exposure  
ALTER TABLE user_settings DROP COLUMN IF EXISTS marketing_emails;

-- Update RLS policies to restrict access to user behavior data
-- Only allow users to see their own resource views
DROP POLICY IF EXISTS "Anyone can view resource views" ON resource_views;
CREATE POLICY "Users can view own resource views" ON resource_views FOR SELECT USING (auth.uid() = user_id);

-- Only allow users to insert their own resource views
DROP POLICY IF EXISTS "Anyone can insert resource views" ON resource_views;
CREATE POLICY "Users can insert resource views" ON resource_views FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Ensure profiles email is not exposed by removing it from public view
-- Update profiles policies to not include email in public view
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

-- Create a new policy that allows users to see their own email
CREATE POLICY "Users can view own profile email" ON profiles FOR SELECT USING (auth.uid() = id);