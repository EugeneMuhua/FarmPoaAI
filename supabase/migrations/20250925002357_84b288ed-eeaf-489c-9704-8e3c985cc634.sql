-- Step 1: Drop the overly permissive policy
DROP POLICY IF EXISTS "Limited farmer info for marketplace" ON public.profiles;

-- Step 2: Create a more secure policy that only exposes essential public farmer information
CREATE POLICY "Public farmer directory info only" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'farmer' 
  AND auth.uid() IS NOT NULL
  AND full_name IS NOT NULL
);