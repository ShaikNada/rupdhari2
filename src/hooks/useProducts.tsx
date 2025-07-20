import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/furnitureData';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database products to match our Product interface
      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '',
        category: product.category,
        theme: product.theme,
        product_number: product.product_number,
        date: new Date(product.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }).toUpperCase()
      }));

      setProducts(transformedProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductsByTheme = (theme: string) => {
    return products.filter(product => product.theme === theme);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    getProductsByTheme,
    getProductsByCategory
  };
};