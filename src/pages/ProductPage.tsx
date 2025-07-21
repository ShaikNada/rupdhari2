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
  const { productName } = useParams();
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [currentProduct, setCurrentProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedCushion, setSelectedCushion] = useState<string>('');

  const woodTypes = {
    'Teak': 'teak',
    'Walnut': 'walnut', 
    'Pine': 'pine',
    'Mango': 'mango',
    'Plywood': 'plywood'
  };

  const cushionTypes = {
    'Polyester': 'polyester',
    'Foam': 'foam',
    'Down': 'down', 
    'Cotton': 'cotton',
    'Shell': 'shell'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productName) return;
      
      try {
        // Fetch all products with the same name (different customizations)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('name', decodeURIComponent(productName));

        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(data);
          setCurrentProduct(data[0]);
          setSelectedWood(data[0].wood_type || 'teak');
          setSelectedCushion(data[0].cushion_type || 'polyester');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productName]);

  useEffect(() => {
    // Find product with matching customization
    const matchingProduct = products.find(p => 
      p.wood_type === selectedWood && p.cushion_type === selectedCushion
    );
    
    if (matchingProduct) {
      setCurrentProduct(matchingProduct);
    }
  }, [selectedWood, selectedCushion, products]);

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

  if (!currentProduct) {
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

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navigation />
      
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link 
          to={`/themes/${currentProduct.theme}`}
          className="inline-flex items-center text-warm-gold hover:text-deep-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {currentProduct.theme.replace('-', ' ').toUpperCase()}
        </Link>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Product Name and Code Number */}
        <div className="mb-8">
          <div className="bg-soft-brown text-cream p-6 rounded-lg inline-block">
            <h1 className="text-3xl font-brahmos font-bold uppercase">{currentProduct.name}</h1>
          </div>
          <div className="mt-4">
            <span className="text-lg text-deep-blue font-medium">Code No. {currentProduct.product_number}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Product Images */}
          <div className="space-y-6">
            {/* 4 View Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-card rounded-lg overflow-hidden shadow-soft">
                <img 
                  src={currentProduct.view1_image_url || currentProduct.image_url} 
                  alt="View 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-card rounded-lg overflow-hidden shadow-soft">
                <img 
                  src={currentProduct.view2_image_url || currentProduct.image_url} 
                  alt="View 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-card rounded-lg overflow-hidden shadow-soft">
                <img 
                  src={currentProduct.view3_image_url || currentProduct.image_url} 
                  alt="View 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-card rounded-lg overflow-hidden shadow-soft">
                <img 
                  src={currentProduct.view4_image_url || currentProduct.image_url} 
                  alt="View 4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Description */}
            {currentProduct.description && (
              <div className="mt-8">
                <h3 className="font-serif text-xl text-deep-blue mb-4">Description</h3>
                <p className="text-deep-blue/80 leading-relaxed">{currentProduct.description}</p>
              </div>
            )}
          </div>

          {/* Right Side - Customization */}
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-lg shadow-soft">
              <h2 className="text-2xl font-serif text-deep-blue mb-2">Crafted to Your Specifications</h2>
              <p className="text-deep-blue/70 mb-8">Personalization at Your Fingertips</p>
              
              {/* Large Customized Image */}
              <div className="aspect-square bg-taupe/20 rounded-lg overflow-hidden mb-8">
                <img 
                  src={currentProduct.customized_image_url || currentProduct.image_url} 
                  alt="Customized furniture"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Wood Selection */}
              <div className="mb-8">
                <h4 className="font-medium text-deep-blue mb-4 flex items-center">
                  <span className="w-2 h-2 bg-warm-gold rounded-full mr-2"></span>
                  Wood
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-deep-blue/70 mb-2">Solid wood</p>
                    <div className="grid grid-cols-4 gap-3">
                      {['Teak', 'Walnut', 'Pine', 'Mango'].map((wood) => (
                        <button
                          key={wood}
                          onClick={() => setSelectedWood(woodTypes[wood as keyof typeof woodTypes])}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedWood === woodTypes[wood as keyof typeof woodTypes]
                              ? 'border-warm-gold bg-warm-gold/10' 
                              : 'border-taupe/30 hover:border-warm-gold/50'
                          }`}
                        >
                          <div className="aspect-square bg-gradient-to-br from-amber-200 to-amber-400 rounded mb-2"></div>
                          <p className="text-xs text-deep-blue font-medium">{wood}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-deep-blue/50 font-medium">OR</span>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => setSelectedWood('plywood')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedWood === 'plywood'
                          ? 'border-warm-gold bg-warm-gold/10' 
                          : 'border-taupe/30 hover:border-warm-gold/50'
                      }`}
                    >
                      <p className="font-medium text-deep-blue">Plywood</p>
                      <p className="text-xs text-deep-blue/70">Endless veneer shade options tailored to your taste.</p>
                      <p className="text-xs text-deep-blue/70">Ensuring a seamless blend with your overall design aesthetic.</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cushioning Selection */}
              <div className="mb-8">
                <h4 className="font-medium text-deep-blue mb-4 flex items-center">
                  <span className="w-2 h-2 bg-warm-gold rounded-full mr-2"></span>
                  Cushioning
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(cushionTypes).map(([display, value]) => (
                    <button
                      key={value}
                      onClick={() => setSelectedCushion(value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCushion === value
                          ? 'border-warm-gold bg-warm-gold/10' 
                          : 'border-taupe/30 hover:border-warm-gold/50'
                      }`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-green-200 to-green-400 rounded mb-2"></div>
                      <p className="text-xs text-deep-blue font-medium">{display}</p>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-deep-blue/60 mb-6 flex items-center">
                <span className="w-2 h-2 bg-warm-gold rounded-full mr-2"></span>
                Size can be customized based on customer preferences.
              </p>

              {/* Price */}
              <div className="text-center pt-6 border-t border-taupe/20">
                <p className="text-3xl font-bold text-rich-brown">₱{currentProduct.price.toLocaleString()}</p>
              </div>
            </div>

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