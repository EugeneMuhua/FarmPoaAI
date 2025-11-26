-- Drop the current limited farmer info policy that might still expose phone numbers
DROP POLICY IF EXISTS "Limited farmer info for marketplace" ON public.profiles;

-- Create a more restrictive policy that completely excludes sensitive data
-- This policy will only allow viewing basic farmer info through the secure function
-- No direct table access for farmer profiles from other users
CREATE POLICY "No direct farmer profile access" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id -- Users can only see their own profile directly
);

-- Update the secure function to ensure it never returns phone numbers or other sensitive data
CREATE OR REPLACE FUNCTION public.get_farmer_profiles()
RETURNS TABLE (
  user_id uuid,
  full_name text,
  location text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.full_name,
    p.location
  FROM public.profiles p
  WHERE p.user_type = 'farmer'
    AND p.full_name IS NOT NULL; -- Only return farmers with names
END;
$$;