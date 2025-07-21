import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Minus, ZoomIn, Heart, Share } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

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
          setSelectedImage(data[0].view1_image_url || data[0].image_url);
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

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const getImageGallery = () => {
    if (!currentProduct) return [];
    return [
      currentProduct.view1_image_url || currentProduct.image_url,
      currentProduct.view2_image_url,
      currentProduct.view3_image_url,
      currentProduct.view4_image_url
    ].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Product Not Found</h1>
          <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/themes/${currentProduct.theme}`} className="hover:text-foreground transition-colors">
              {currentProduct.theme.replace('-', ' ').toUpperCase()}
            </Link>
            <span>/</span>
            <span className="text-foreground">{currentProduct.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Product Images */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden group relative">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-zoom-in relative">
                    <img 
                      src={selectedImage} 
                      alt={currentProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 text-white p-2 rounded-full">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img 
                    src={selectedImage} 
                    alt={currentProduct.name}
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {getImageGallery().map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square bg-card rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-serif text-foreground mb-2">{currentProduct.name}</h1>
                  <p className="text-sm text-muted-foreground">Code: {currentProduct.product_number}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-foreground">
                ₹{currentProduct.price.toLocaleString()}
              </div>
            </div>

            {/* Product Description */}
            {currentProduct.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">{currentProduct.description}</p>
              </div>
            )}

            {/* Customization Section */}
            <div className="space-y-6 bg-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Customize Your Piece</h3>
              
              {/* Wood Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Wood Type</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    {['Teak', 'Walnut', 'Pine', 'Mango'].map((wood) => (
                      <button
                        key={wood}
                        onClick={() => setSelectedWood(woodTypes[wood as keyof typeof woodTypes])}
                        className={`aspect-square rounded-lg border-2 p-2 transition-all hover:shadow-md ${
                          selectedWood === woodTypes[wood as keyof typeof woodTypes]
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <div className="w-full h-3/4 bg-gradient-to-br from-amber-200 to-amber-600 rounded mb-1"></div>
                        <div className="text-xs font-medium">{wood}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">OR</span>
                    <button
                      onClick={() => setSelectedWood('plywood')}
                      className={`px-4 py-2 rounded-md border text-xs transition-all ${
                        selectedWood === 'plywood'
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      Plywood
                    </button>
                  </div>
                </div>
              </div>

              {/* Cushioning Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Cushioning</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(cushionTypes).map(([display, value]) => (
                    <button
                      key={value}
                      onClick={() => setSelectedCushion(value)}
                      className={`aspect-square rounded-lg border-2 p-2 transition-all hover:shadow-md ${
                        selectedCushion === value
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="w-full h-3/4 bg-gradient-to-br from-blue-200 to-blue-400 rounded mb-1"></div>
                      <div className="text-xs font-medium">{display}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization Note */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  All dimensions can be customized to fit your space perfectly. Contact us for personalized measurements.
                </p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full">
                  Contact for Custom Order
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  Request Quote
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{currentProduct.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span>{currentProduct.theme.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span>4-6 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;