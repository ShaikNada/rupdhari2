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

        {/* Main Content - Enhanced Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          
          {/* Left Side - Product Images Grid with Animation */}
          <div className="space-y-8">
            {/* Aesthetic 4 View Images Grid */}
            <div className="grid grid-cols-2 gap-6 animate-fade-in">
              {[
                { src: currentProduct.view1_image_url, alt: "Front View", label: "01" },
                { src: currentProduct.view2_image_url, alt: "Side View", label: "02" },
                { src: currentProduct.view3_image_url, alt: "Back View", label: "03" },
                { src: currentProduct.view4_image_url, alt: "Detail View", label: "04" }
              ].map((view, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-elegant hover-scale">
                  <div className="aspect-square bg-gradient-to-br from-taupe/10 to-warm-beige/20 overflow-hidden">
                    <img 
                      src={view.src || currentProduct.image_url} 
                      alt={view.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-deep-blue px-3 py-1 rounded-full text-sm font-medium">
                    {view.label}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Enhanced Description Section */}
            {currentProduct.description && (
              <div className="mt-12 bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-soft animate-fade-in">
                <h3 className="font-serif text-2xl text-deep-blue mb-6 flex items-center">
                  <span className="w-3 h-3 bg-warm-gold rounded-full mr-3"></span>
                  Description
                </h3>
                <p className="text-deep-blue/80 leading-relaxed text-lg">{currentProduct.description}</p>
              </div>
            )}
          </div>

          {/* Right Side - Enhanced Customization Panel */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-elegant animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif text-deep-blue mb-3">Crafted to Your Specifications</h2>
                <p className="text-deep-blue/70 text-lg">Personalization at Your Fingertips</p>
              </div>
              
              {/* Large Customized Image with Enhanced Styling */}
              <div className="relative mb-10 group">
                <div className="aspect-square bg-gradient-to-br from-taupe/10 via-warm-beige/20 to-soft-brown/10 rounded-2xl overflow-hidden shadow-elegant">
                  <img 
                    src={currentProduct.customized_image_url || currentProduct.image_url} 
                    alt="Customized furniture"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Enhanced Wood Selection */}
              <div className="mb-10">
                <h4 className="font-semibold text-deep-blue mb-6 flex items-center text-lg">
                  <span className="w-3 h-3 bg-warm-gold rounded-full mr-3"></span>
                  Wood Selection
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-deep-blue/70 mb-4 font-medium">Solid Wood Options</p>
                    <div className="grid grid-cols-2 gap-4">
                      {['Teak', 'Walnut', 'Pine', 'Mango'].map((wood) => (
                        <button
                          key={wood}
                          onClick={() => setSelectedWood(woodTypes[wood as keyof typeof woodTypes])}
                          className={`group p-4 rounded-xl border-2 transition-all duration-300 hover-scale ${
                            selectedWood === woodTypes[wood as keyof typeof woodTypes]
                              ? 'border-warm-gold bg-warm-gold/10 shadow-soft' 
                              : 'border-taupe/30 hover:border-warm-gold/50 hover:shadow-soft'
                          }`}
                        >
                          <div className="aspect-square bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 rounded-lg mb-3 shadow-soft group-hover:shadow-elegant transition-shadow duration-300"></div>
                          <p className="text-sm text-deep-blue font-semibold">{wood}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-px bg-taupe/30 w-16"></div>
                      <span className="text-deep-blue/50 font-medium text-sm">OR</span>
                      <div className="h-px bg-taupe/30 w-16"></div>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => setSelectedWood('plywood')}
                      className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left hover-scale ${
                        selectedWood === 'plywood'
                          ? 'border-warm-gold bg-warm-gold/10 shadow-soft' 
                          : 'border-taupe/30 hover:border-warm-gold/50 hover:shadow-soft'
                      }`}
                    >
                      <p className="font-semibold text-deep-blue mb-2">Plywood</p>
                      <p className="text-sm text-deep-blue/70 leading-relaxed">Endless veneer shade options tailored to your taste, ensuring a seamless blend with your overall design aesthetic.</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Cushioning Selection */}
              <div className="mb-8">
                <h4 className="font-semibold text-deep-blue mb-6 flex items-center text-lg">
                  <span className="w-3 h-3 bg-warm-gold rounded-full mr-3"></span>
                  Cushioning Options
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(cushionTypes).map(([display, value]) => (
                    <button
                      key={value}
                      onClick={() => setSelectedCushion(value)}
                      className={`group p-4 rounded-xl border-2 transition-all duration-300 hover-scale ${
                        selectedCushion === value
                          ? 'border-warm-gold bg-warm-gold/10 shadow-soft' 
                          : 'border-taupe/30 hover:border-warm-gold/50 hover:shadow-soft'
                      }`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-green-200 via-green-300 to-green-400 rounded-lg mb-3 shadow-soft group-hover:shadow-elegant transition-shadow duration-300"></div>
                      <p className="text-xs text-deep-blue font-semibold">{display}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-warm-gold/10 p-4 rounded-xl mb-8">
                <p className="text-sm text-deep-blue/80 flex items-center">
                  <span className="w-2 h-2 bg-warm-gold rounded-full mr-3"></span>
                  Size can be customized based on customer preferences.
                </p>
              </div>

              {/* Enhanced Price Display */}
              <div className="text-center py-8 border-t border-warm-gold/20">
                <div className="bg-gradient-to-r from-rich-brown/10 to-warm-gold/10 p-6 rounded-xl">
                  <p className="text-4xl font-bold bg-gradient-to-r from-rich-brown to-warm-gold bg-clip-text text-transparent">
                    ₱{currentProduct.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Button */}
            <Button 
              size="lg" 
              className="w-full font-semibold text-xl py-8 bg-gradient-to-r from-warm-gold to-rich-brown hover:from-rich-brown hover:to-warm-gold transition-all duration-300 hover-scale shadow-elegant hover:shadow-glow"
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