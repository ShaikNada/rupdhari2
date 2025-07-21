
-- Drop the existing problematic constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS unique_main_product_number;

-- Create a partial unique index that only applies to main variants
CREATE UNIQUE INDEX unique_main_product_number_only 
ON products (product_number) 
WHERE is_main_variant = true;

-- Also ensure we have the correct index for variation lookups
DROP INDEX IF EXISTS idx_products_variation_lookup;
CREATE INDEX idx_products_variation_lookup 
ON products(product_number, wood_type, cushion_type, is_main_variant);
