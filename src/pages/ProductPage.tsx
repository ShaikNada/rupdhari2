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
        {/* Product Name and Code Number - Enhanced Layout */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="bg-gradient-to-r from-soft-brown via-warm-gold/20 to-soft-brown text-cream p-8 rounded-2xl inline-block shadow-elegant mb-6">
            <h1 className="text-4xl font-brahmos font-bold uppercase tracking-wide">{currentProduct.name}</h1>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full inline-block shadow-soft">
            <span className="text-xl text-deep-blue font-semibold">Code No. {currentProduct.product_number}</span>
          </div>
        </div>

        {/* Main Content - Two Column Layout Based on Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-12">
          
          {/* Left Side - Product Images and Description */}
          <div className="space-y-8">
            {/* 4 View Images Grid - Matching Reference Layout */}
            <div className="grid grid-cols-[200px,1fr] gap-6">
              {/* Main First Image */}
              <div className="aspect-[4/5] bg-gradient-to-br from-taupe/10 to-warm-beige/20 rounded-lg overflow-hidden shadow-soft">
                <img 
                  src={currentProduct.view1_image_url || currentProduct.image_url} 
                  alt="Main View"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Right Grid - 3 smaller images */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { src: currentProduct.view2_image_url, alt: "View 2" },
                  { src: currentProduct.view3_image_url, alt: "View 3" },
                  { src: currentProduct.view4_image_url, alt: "View 4" }
                ].map((view, index) => (
                  <div key={index} className="aspect-[3/2] bg-gradient-to-br from-taupe/10 to-warm-beige/20 rounded-lg overflow-hidden shadow-soft">
                    <img 
                      src={view.src || currentProduct.image_url} 
                      alt={view.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            {currentProduct.description && (
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-semibold text-deep-blue mb-3">Description</h3>
                <p className="text-deep-blue/80 text-sm leading-relaxed">{currentProduct.description}</p>
              </div>
            )}
          </div>

          {/* Right Side - Customization Panel Matching Reference */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-elegant">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-deep-blue mb-1">Crafted to Your Specifications</h2>
              <p className="text-deep-blue/60 text-sm">Personalization at Your Fingertips</p>
            </div>
            
            {/* Large Customized Image */}
            <div className="aspect-square bg-gradient-to-br from-taupe/10 to-warm-beige/20 rounded-lg overflow-hidden shadow-soft mb-6">
              <img 
                src={currentProduct.customized_image_url || currentProduct.image_url} 
                alt="Customized furniture"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Wood Selection - Small Options */}
            <div className="mb-6">
              <h4 className="font-medium text-deep-blue mb-3 flex items-center">
                <span className="w-2 h-2 bg-warm-gold rounded-full mr-2"></span>
                Wood
              </h4>
              
              <div className="space-y-3">
                {/* Solid Wood Options */}
                <div>
                  <p className="text-xs text-deep-blue/60 mb-2">Solid wood</p>
                  <div className="flex gap-2">
                    {['Teak', 'Walnut', 'Pine', 'Mango'].map((wood) => (
                      <button
                        key={wood}
                        onClick={() => setSelectedWood(woodTypes[wood as keyof typeof woodTypes])}
                        className={`w-12 h-12 rounded border-2 transition-all duration-200 ${
                          selectedWood === woodTypes[wood as keyof typeof woodTypes]
                            ? 'border-warm-gold bg-warm-gold/10' 
                            : 'border-taupe/30 hover:border-warm-gold/50'
                        }`}
                      >
                        <div className="w-full h-8 bg-gradient-to-br from-amber-200 to-amber-400 rounded-sm mb-1"></div>
                        <p className="text-[8px] text-deep-blue font-medium">{wood}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Plywood Option */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-deep-blue/60">OR</span>
                  <button
                    onClick={() => setSelectedWood('plywood')}
                    className={`px-4 py-2 rounded border text-xs transition-all duration-200 ${
                      selectedWood === 'plywood'
                        ? 'border-warm-gold bg-warm-gold/10 text-deep-blue' 
                        : 'border-taupe/30 text-deep-blue/70 hover:border-warm-gold/50'
                    }`}
                  >
                    Plywood
                  </button>
                </div>
                <p className="text-[10px] text-deep-blue/60 leading-tight">
                  Endless veneer shade options tailored to your taste.
                </p>
              </div>
            </div>

            {/* Cushioning Selection - Small Options */}
            <div className="mb-6">
              <h4 className="font-medium text-deep-blue mb-3 flex items-center">
                <span className="w-2 h-2 bg-warm-gold rounded-full mr-2"></span>
                Cushioning
              </h4>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(cushionTypes).map(([display, value]) => (
                  <button
                    key={value}
                    onClick={() => setSelectedCushion(value)}
                    className={`w-12 h-12 rounded border-2 transition-all duration-200 ${
                      selectedCushion === value
                        ? 'border-warm-gold bg-warm-gold/10' 
                        : 'border-taupe/30 hover:border-warm-gold/50'
                    }`}
                  >
                    <div className="w-full h-8 bg-gradient-to-br from-green-200 to-green-400 rounded-sm mb-1"></div>
                    <p className="text-[8px] text-deep-blue font-medium">{display}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Note */}
            <div className="bg-warm-gold/10 p-3 rounded mb-6">
              <p className="text-xs text-deep-blue/70 flex items-center">
                <span className="w-1 h-1 bg-warm-gold rounded-full mr-2"></span>
                Size can be customized based on customer preferences.
              </p>
            </div>

            {/* Price Display */}
            <div className="text-center py-6 border-t border-warm-gold/20 mb-6">
              <p className="text-3xl font-bold bg-gradient-to-r from-rich-brown to-warm-gold bg-clip-text text-transparent">
                ₱{currentProduct.price.toLocaleString()}
              </p>
            </div>

            {/* Contact Button */}
            <Button 
              size="lg" 
              className="w-full font-semibold bg-gradient-to-r from-warm-gold to-rich-brown hover:from-rich-brown hover:to-warm-gold transition-all duration-300"
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