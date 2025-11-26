-- Drop the old check constraint
ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_type_check;

-- Add updated check constraint with all valid user types
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type = ANY (ARRAY['farmer'::text, 'buyer'::text, 'specialist'::text, 'consumer'::text]));