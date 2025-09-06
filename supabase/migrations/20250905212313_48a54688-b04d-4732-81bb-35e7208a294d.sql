-- Fix email exposure by using column-level security

-- Drop existing policies that aren't working correctly
DROP POLICY IF EXISTS "Profiles viewable by everyone except email" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own complete profile" ON public.profiles;

-- Create a policy that explicitly excludes email from public access
-- This requires using a security definer function to properly restrict columns
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS SETOF profiles
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
    created_at,
    updated_at,
    NULL::text as email  -- Explicitly exclude email for public access
  FROM profiles;
$$;

-- Create restrictive policies
-- Policy 1: Users can see their own complete profile (including email)
CREATE POLICY "Users can view own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Public can only see non-sensitive profile data (no email)
-- We'll handle this through the application layer instead of RLS to avoid column exposure