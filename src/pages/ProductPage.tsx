
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { ContactFormDialog } from "@/components/ContactFormDialog";

const ProductPage = () => {
  const { productName } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWood, setSelectedWood] = useState("teak");
  const [selectedCushioning, setSelectedCushioning] = useState("polyester");
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [mainImage, setMainImage] = useState("");

  // Fetch product and its variations
  const { data: products, isLoading } = useQuery({
    queryKey: ['product', productName],
    queryFn: async () => {
      if (!productName) return null;
      
      const decodedName = decodeURIComponent(productName);
      
      // First get the main product (is_main_variant = true)
      const { data: mainProduct, error: mainError } = await supabase
        .from('products')
        .select('*')
        .eq('name', decodedName)
        .eq('is_main_variant', true)
        .maybeSingle();
      
      if (mainError) throw mainError;
      if (!mainProduct) return null;
      
      // Then get all variations with the same name and product_number
      const { data: variations, error: variationsError } = await supabase
        .from('products')
        .select('*')
        .eq('name', decodedName)
        .eq('product_number', mainProduct.product_number);
      
      if (variationsError) throw variationsError;
      
      return { mainProduct, variations: variations || [] };
    },
  });

  // Update main image when customization changes
  useEffect(() => {
    if (products && products.variations) {
      const currentVariant = products.variations.find(v => 
        v.wood_type === selectedWood && v.cushion_type === selectedCushioning && !v.is_main_variant
      );
      
      if (currentVariant && currentVariant.customized_image_url) {
        setMainImage(currentVariant.customized_image_url);
      } else if (products.mainProduct.image_url) {
        setMainImage(products.mainProduct.image_url);
      }
    }
  }, [selectedWood, selectedCushioning, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!products || !products.mainProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Product not found</h2>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { mainProduct, variations } = products;
  
  // Find the variation that matches selected options or fall back to main product
  const currentVariant = variations.find(v => 
    v.wood_type === selectedWood && v.cushion_type === selectedCushioning && !v.is_main_variant
  ) || mainProduct;

  // Product images - using the view images from any variant that has them
  const variantWithViews = variations.find(v => v.view1_image_url) || mainProduct;
  const productImages = [
    mainImage || mainProduct.image_url,
    variantWithViews.view1_image_url,
    variantWithViews.view2_image_url,
    variantWithViews.view3_image_url,
    variantWithViews.view4_image_url,
  ].filter(Boolean);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage(prev => (prev - 1 + productImages.length) % productImages.length);
  };

  const woodOptions = [
    { name: 'Teak', value: 'teak', type: 'solid', description: 'Premium hardwood with natural oils' },
    { name: 'Walnut', value: 'walnut', type: 'solid', description: 'Rich grain and durability' },
    { name: 'Pine', value: 'pine', type: 'solid', description: 'Light and sustainable' },
    { name: 'Mango', value: 'mango', type: 'solid', description: 'Eco-friendly tropical wood' },
    { name: 'Plywood', value: 'plywood', type: 'engineered', description: 'Engineered wood alternative' }
  ];

  const cushioningOptions = [
    { name: 'Polyester', value: 'polyester', description: 'Durable and easy care' },
    { name: 'Foam', value: 'foam', description: 'Memory support comfort' },
    { name: 'Down', value: 'down', description: 'Luxurious and soft' },
    { name: 'Cotton', value: 'cotton', description: 'Natural and breathable' },
    { name: 'Shell', value: 'shell', description: 'Firm structural support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Product Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            
            {/* Left - Image Gallery */}
            <div className="space-y-6">
              {/* Main Image Display */}
              <div className="relative group">
                <div className="aspect-[4/3] bg-card rounded-2xl overflow-hidden shadow-elegant">
                  {productImages.length > 0 && (
                    <>
                      <Dialog>
                        <DialogTrigger className="w-full h-full">
                          <img 
                            src={productImages[selectedImage]} 
                            alt={mainProduct.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl p-2">
                          <img 
                            src={productImages[selectedImage]} 
                            alt={mainProduct.name}
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                      
                      {/* Navigation Arrows */}
                      {productImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Image Thumbnails */}
                {productImages.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-primary shadow-lg scale-105' 
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
                )}
              </div>
            </div>

            {/* Right - Product Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    {mainProduct.product_number}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                  </div>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-serif text-foreground leading-tight">
                  {mainProduct.name}
                </h1>
                
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary">
                    ₹{currentVariant.price?.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{(currentVariant.price * 1.2)?.toLocaleString()}
                  </span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Save 20%
                  </Badge>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {mainProduct.description || "Experience exceptional craftsmanship with this beautiful piece of furniture. Each item is carefully crafted with attention to detail and premium materials, designed to enhance your living space with timeless elegance."}
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" size="lg">
                  Share
                </Button>
              </div>

              <Card className="p-6 bg-card/50 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">Quantity:</span>
                    <div className="flex items-center border rounded-xl bg-background">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity === 1}
                        className="rounded-l-xl"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-6 py-2 min-w-[4rem] text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        className="rounded-r-xl"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                    onClick={() => setIsContactFormOpen(true)}
                  >
                    Contact for Custom Order
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Customization Section */}
          <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-luxury">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-serif text-foreground mb-4">
                  Customize Your Piece
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Select from our premium materials to create your perfect furniture piece
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Customized Preview */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">Your Configuration</h3>
                    <div className="aspect-square bg-muted/30 rounded-2xl overflow-hidden shadow-elegant">
                      <img 
                        src={mainImage || mainProduct.image_url} 
                        alt="Customized view"
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>
                    <div className="mt-4 p-4 bg-background/50 rounded-xl">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wood:</span>
                          <span className="font-medium capitalize">{selectedWood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cushioning:</span>
                          <span className="font-medium capitalize">{selectedCushioning}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-bold text-primary">₹{currentVariant.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wood Selection */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">Wood Selection</h3>
                    <p className="text-muted-foreground mb-6">Choose from solid wood or engineered options</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Solid Wood</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {woodOptions.filter(wood => wood.type === 'solid').map((wood) => {
                        // Find variation image for this wood with current cushioning
                        const variation = variations.find(v => 
                          v.wood_type === wood.value && v.cushion_type === selectedCushioning && !v.is_main_variant
                        );
                        
                        return (
                          <button
                            key={wood.value}
                            onClick={() => setSelectedWood(wood.value)}
                            className={`group p-3 rounded-xl border-2 transition-all text-left ${
                              selectedWood === wood.value
                                ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                                : 'border-border hover:border-primary/50 hover:shadow-md'
                            }`}
                          >
                            <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-300 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                              {variation?.customized_image_url ? (
                                <img 
                                  src={variation.customized_image_url} 
                                  alt={wood.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded"></div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h5 className="font-medium text-sm">{wood.name}</h5>
                              <p className="text-xs text-muted-foreground">{wood.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Engineered Wood</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {woodOptions.filter(wood => wood.type === 'engineered').map((wood) => {
                        const variation = variations.find(v => 
                          v.wood_type === wood.value && v.cushion_type === selectedCushioning && !v.is_main_variant
                        );
                        
                        return (
                          <button
                            key={wood.value}
                            onClick={() => setSelectedWood(wood.value)}
                            className={`group p-4 rounded-xl border-2 transition-all text-left ${
                              selectedWood === wood.value
                                ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                                : 'border-border hover:border-primary/50 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                {variation?.customized_image_url ? (
                                  <img 
                                    src={variation.customized_image_url} 
                                    alt={wood.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded"></div>
                                )}
                              </div>
                              <div className="space-y-1">
                                <h5 className="font-medium">{wood.name}</h5>
                                <p className="text-xs text-muted-foreground">{wood.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Cushioning Options */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">Cushioning</h3>
                    <p className="text-muted-foreground mb-6">Select your preferred comfort level</p>
                  </div>
                  
                  <div className="space-y-3">
                    {cushioningOptions.map((cushion) => {
                      const variation = variations.find(v => 
                        v.wood_type === selectedWood && v.cushion_type === cushion.value && !v.is_main_variant
                      );
                      
                      return (
                        <button
                          key={cushion.value}
                          onClick={() => setSelectedCushioning(cushion.value)}
                          className={`group w-full p-3 rounded-xl border-2 transition-all text-left ${
                            selectedCushioning === cushion.value
                              ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                              : 'border-border hover:border-primary/50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg flex items-center justify-center overflow-hidden">
                              {variation?.customized_image_url ? (
                                <img 
                                  src={variation.customized_image_url} 
                                  alt={cushion.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded"></div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h5 className="font-medium text-sm">{cushion.name}</h5>
                              <p className="text-xs text-muted-foreground">{cushion.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactFormDialog
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        productName={mainProduct.name}
        productCode={mainProduct.product_number}
        selectedWood={selectedWood}
        selectedCushioning={selectedCushioning}
      />
    </div>
  );
};

export default ProductPage;
