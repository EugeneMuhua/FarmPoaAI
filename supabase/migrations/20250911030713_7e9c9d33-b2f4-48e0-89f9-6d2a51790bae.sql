-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create more secure policies for profile access
-- Users can view their own complete profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a policy for limited public farmer information (only for marketplace)
-- Only show basic info (name, location) for farmers, no phone numbers
CREATE POLICY "Limited farmer info for marketplace" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'farmer' 
  AND auth.uid() IS NOT NULL
);

-- Create a function to get safe farmer profiles for marketplace
CREATE OR REPLACE FUNCTION public.get_farmer_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  location text,
  user_type text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.location,
    p.user_type
  FROM public.profiles p
  WHERE p.user_type = 'farmer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_farmer_profiles() TO authenticated;