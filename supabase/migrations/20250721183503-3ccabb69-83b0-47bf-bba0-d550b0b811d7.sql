
-- First, let's add a unique constraint that allows multiple variations of the same product
-- Drop the existing unique constraint on product_number if it exists
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_number_key;

-- Create a new unique constraint that allows multiple variants with same product_number
-- but ensures main variants are unique
ALTER TABLE products ADD CONSTRAINT unique_main_product_number 
UNIQUE (product_number, is_main_variant) 
DEFERRABLE INITIALLY DEFERRED;

-- Add an index for better performance on variation lookups
CREATE INDEX IF NOT EXISTS idx_products_variation_lookup 
ON products(product_number, wood_type, cushion_type, is_main_variant);

-- Add an index for customization image lookups
CREATE INDEX IF NOT EXISTS idx_products_customized_image 
ON products(wood_type, cushion_type) WHERE customized_image_url IS NOT NULL;
