-- Add customization fields to products table
ALTER TABLE public.products 
ADD COLUMN description TEXT,
ADD COLUMN view1_image_url TEXT,
ADD COLUMN view2_image_url TEXT,
ADD COLUMN view3_image_url TEXT,
ADD COLUMN view4_image_url TEXT,
ADD COLUMN wood_type TEXT,
ADD COLUMN cushion_type TEXT,
ADD COLUMN customized_image_url TEXT;