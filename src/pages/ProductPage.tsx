import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  theme: string;
  product_number: string;
  description?: string;
  view1_image_url?: string;
  view2_image_url?: string;
  view3_image_url?: string;
  view4_image_url?: string;
  wood_type?: string;
  cushion_type?: string;
  customized_image_url?: string;
}

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'main' | 'view1' | 'view2' | 'view3' | 'view4'>('main');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .maybeSingle();

        if (error) throw error;
        if (data) setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-deep-blue/60">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <Navigation />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-serif text-deep-blue mb-4">Product Not Found</h1>
          <Link to="/" className="text-warm-gold hover:text-deep-blue transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const getActiveImage = () => {
    switch (activeView) {
      case 'view1': return product.view1_image_url || product.image_url;
      case 'view2': return product.view2_image_url || product.image_url;
      case 'view3': return product.view3_image_url || product.image_url;
      case 'view4': return product.view4_image_url || product.image_url;
      default: return product.image_url;
    }
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navigation />
      
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link 
          to={`/themes/${product.theme}`}
          className="inline-flex items-center text-warm-gold hover:text-deep-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {product.theme.replace('-', ' ').toUpperCase()}
        </Link>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Product Images */}
          <div className="space-y-6">
            {/* Product Name and Code */}
            <div className="bg-soft-brown text-cream p-4 rounded-lg">
              <h1 className="text-2xl font-brahmos font-bold uppercase">{product.name}</h1>
              <p className="text-sm opacity-80">Code No. {product.product_number}</p>
            </div>

            {/* Main Image Display */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden shadow-soft">
              <img 
                src={getActiveImage()} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Grid Navigation */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveView('view1')}
                className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                  activeView === 'view1' ? 'border-warm-gold' : 'border-taupe/30'
                }`}
              >
                <img 
                  src={product.view1_image_url || product.image_url} 
                  alt="View 1"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={() => setActiveView('view2')}
                className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                  activeView === 'view2' ? 'border-warm-gold' : 'border-taupe/30'
                }`}
              >
                <img 
                  src={product.view2_image_url || product.image_url} 
                  alt="View 2"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={() => setActiveView('view3')}
                className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                  activeView === 'view3' ? 'border-warm-gold' : 'border-taupe/30'
                }`}
              >
                <img 
                  src={product.view3_image_url || product.image_url} 
                  alt="View 3"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={() => setActiveView('view4')}
                className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                  activeView === 'view4' ? 'border-warm-gold' : 'border-taupe/30'
                }`}
              >
                <img 
                  src={product.view4_image_url || product.image_url} 
                  alt="View 4"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-8">
            
            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-serif text-xl text-deep-blue mb-4">Description</h3>
                <p className="text-deep-blue/80 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Price */}
            <div>
              <p className="text-3xl font-bold text-rich-brown">₱{product.price.toLocaleString()}</p>
            </div>

            {/* Customization Section */}
            {(product.wood_type || product.cushion_type || product.customized_image_url) && (
              <div className="bg-card p-6 rounded-lg shadow-soft">
                <h3 className="font-serif text-xl text-deep-blue mb-4">Crafted to Your Specifications</h3>
                <p className="text-sm text-deep-blue/70 mb-6">Personalization at Your Fingertips</p>
                
                {/* Wood Types */}
                {product.wood_type && (
                  <div className="mb-6">
                    <h4 className="font-medium text-deep-blue mb-3 flex items-center">
                      <span className="w-2 h-2 bg-warm-gold rounded-full mr-2"></span>
                      Wood
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-warm-gold/20 text-deep-blue text-sm rounded border">
                        {product.wood_type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Cushioning */}
                {product.cushion_type && (
                  <div className="mb-6">
                    <h4 className="font-medium text-deep-blue mb-3 flex items-center">
                      <span className="w-2 h-2 bg-warm-gold rounded-full mr-2"></span>
                      Cushioning
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-warm-gold/20 text-deep-blue text-sm rounded border">
                        {product.cushion_type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Customized Image */}
                {product.customized_image_url && (
                  <div>
                    <h4 className="font-medium text-deep-blue mb-3">Custom Design Preview</h4>
                    <div className="aspect-video bg-taupe/20 rounded-lg overflow-hidden">
                      <img 
                        src={product.customized_image_url} 
                        alt="Customized version"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-deep-blue/60 mt-4 italic">
                  Size can be customized based on customer preferences.
                </p>
              </div>
            )}

            {/* Contact Button */}
            <Button 
              size="lg" 
              className="w-full font-medium text-lg py-6"
            >
              Contact for Custom Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;