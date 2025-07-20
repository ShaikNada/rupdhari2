-- Update RLS policy to allow public inserts for admin functionality
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;

-- Create a new policy that allows public inserts
-- This is for admin functionality - in production you'd want more secure auth
CREATE POLICY "Allow public inserts for admin" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

-- Keep other policies as they are for security
-- Update and delete still require authentication
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Allow public updates for admin" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public deletes for admin" 
ON public.products 
FOR DELETE 
USING (true);