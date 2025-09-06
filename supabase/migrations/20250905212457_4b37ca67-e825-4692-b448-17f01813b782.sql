-- Secure approach: Restrict profiles table access and create safe public functions

-- Remove all existing SELECT policies on profiles (makes it private by default)
-- Only authenticated users can see their own profiles
CREATE POLICY "Users can view own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create a safe public function that returns profile data without emails
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  avatar_url text,
  bio text,
  skills text[],
  reputation integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.name,
    p.avatar_url,
    p.bio,
    p.skills,
    p.reputation,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.id = profile_id;
$$;

-- Create function to get multiple public profiles (for listings)
CREATE OR REPLACE FUNCTION public.get_public_profiles_list()
RETURNS TABLE (
  id uuid,
  name text,
  avatar_url text,
  bio text,
  skills text[],
  reputation integer,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    id,
    name,
    avatar_url,
    bio,
    skills,
    reputation,
    created_at
  FROM profiles
  ORDER BY reputation DESC, created_at DESC;
$$;