-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_farmer_profiles();

-- Create the updated secure function with only essential farmer info (no phone numbers)
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_farmer_profiles() TO authenticated;