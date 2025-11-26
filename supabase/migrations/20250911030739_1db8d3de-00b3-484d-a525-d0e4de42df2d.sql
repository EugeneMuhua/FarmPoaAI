-- Update the function to fix search path security warning
CREATE OR REPLACE FUNCTION public.get_farmer_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  location text,
  user_type text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;