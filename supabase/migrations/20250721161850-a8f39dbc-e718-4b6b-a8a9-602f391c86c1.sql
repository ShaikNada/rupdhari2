-- Create orders table for custom furniture orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  wood_type TEXT,
  cushioning_type TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customization_message TEXT,
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders (only admin can access)
CREATE POLICY "Admin can view all orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

CREATE POLICY "Admin can delete orders" 
ON public.orders 
FOR DELETE 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add variation columns to products table for customization handling
ALTER TABLE public.products 
ADD COLUMN is_main_variant BOOLEAN DEFAULT true,
ADD COLUMN parent_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
ADD COLUMN wood_type TEXT,
ADD COLUMN cushion_type TEXT;

-- Create index for faster queries on variations
CREATE INDEX idx_products_parent_variant ON public.products(parent_product_id, is_main_variant);
CREATE INDEX idx_products_name_code ON public.products(name, product_number);