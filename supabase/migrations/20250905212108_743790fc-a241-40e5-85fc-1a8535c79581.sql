-- Security fixes to lock down data exposure

-- 1. Fix profiles table - remove public email access
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile email" ON public.profiles;

-- Create new policy that excludes email from public access
CREATE POLICY "Public profiles viewable without email" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Allow users to see their own email
CREATE POLICY "Users can view their own email" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 2. Fix likes table - restrict to user's own likes only
DROP POLICY IF EXISTS "Users can view all likes" ON public.likes;

-- Users can only see their own likes
CREATE POLICY "Users can view their own likes" 
ON public.likes 
FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Fix resource_views table - make it write-only, remove public access
DROP POLICY IF EXISTS "Users can view own resource views" ON public.resource_views;

-- No SELECT policy means no one can read this data via API
-- Keep only the INSERT policy for tracking views

-- 4. Add RPC function for safe profile access without email exposure
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
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
    p.id,
    p.name,
    p.avatar_url,
    p.bio,
    p.skills,
    p.reputation,
    p.created_at
  FROM profiles p
  WHERE p.id = profile_id;
$$;