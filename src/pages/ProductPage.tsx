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
import Navigation from "@/components/Navigation";

const ProductPage = () => {
  const { productName } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWood, setSelectedWood] = useState<string | null>(null);
  const [selectedCushioning, setSelectedCushioning] = useState<string | null>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [displayImage, setDisplayImage] = useState("");

  // Helper function to safely parse price values
  const safeParsePrice = (price: string | number | null | undefined): number => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const parsed = parseFloat(String(price));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Fetch product and its variations with comprehensive logging
  const { data: products, isLoading, error: queryError } = useQuery({
    queryKey: ['product', productName],
    queryFn: async () => {
      if (!productName) return null;
      
      const decodedName = decodeURIComponent(productName);
      console.log('=== COMPREHENSIVE PRODUCT FETCH DEBUG ===');
      console.log('1. Fetching product:', decodedName);
      console.log('1a. Current timestamp:', new Date().toISOString());
      
      // First get the main product
      const { data: mainProduct, error: mainError } = await supabase
        .from('products')
        .select('*')
        .eq('name', decodedName)
        .eq('is_main_variant', true)
        .maybeSingle();
      
      if (mainError) {
        console.error('2. Main product error:', mainError);
        throw mainError;
      }
      if (!mainProduct) {
        console.log('2. No main product found for:', decodedName);
        return null;
      }
      
      console.log('2. ✅ Found main product:', {
        id: mainProduct.id,
        name: mainProduct.name,
        product_number: mainProduct.product_number,
        price: mainProduct.price,
        price_type: typeof mainProduct.price,
        image_url_length: mainProduct.image_url?.length || 0
      });
      
      // Then get ALL variations with the same product_number
      const { data: allVariations, error: variationsError } = await supabase
        .from('products')
        .select('*')
        .eq('product_number', mainProduct.product_number)
        .eq('is_main_variant', false);
      
      if (variationsError) {
        console.error('3. Variations error:', variationsError);
        throw variationsError;
      }
      
      console.log('3. ✅ Variations found:', allVariations?.length || 0);
      
      // Log each variation with detailed info
      if (allVariations) {
        allVariations.forEach((v, index) => {
          const hasCustomImage = v.customized_image_url && v.customized_image_url.trim() !== '';
          console.log(`4. Variation ${index + 1}: ${v.wood_type}+${v.cushion_type} - ${hasCustomImage ? 'HAS IMAGE (' + v.customized_image_url.length + ' chars)' : 'NO IMAGE'}`);
          if (hasCustomImage && v.customized_image_url.length < 100) {
            console.log(`   WARNING: Image data seems too short: ${v.customized_image_url}`);
          }
        });
      }
      
      // Return a properly structured object with default values to prevent undefined errors
      return {
        mainProduct: {
          ...mainProduct,
          // Ensure price is a number for consistent handling
          price: typeof mainProduct.price === 'string' ? parseFloat(mainProduct.price) || 0 : mainProduct.price || 0
        },
        variations: allVariations?.map(v => ({
          ...v,
          // Ensure price is a number for consistent handling
          price: typeof v.price === 'string' ? parseFloat(v.price) || 0 : v.price || 0
        })) || []
      };
    },
  });

  // Update display image when customization changes - optimized
  useEffect(() => {
    // Skip if products data isn't loaded yet
    if (!products || !products.variations || !products.mainProduct) {
      console.log('=== IMAGE SELECTION DEBUG ===');
      console.log('5. Skipping image selection - products data not fully loaded');
      return;
    }
    
    console.log('=== IMAGE SELECTION DEBUG ===');
    console.log('5. Selected combination:', { wood: selectedWood, cushioning: selectedCushioning });
    console.log('5. Available variations:', products.variations.length);
    console.log('5. Timestamp:', new Date().toISOString());
    
    // Find exact match with image
    const exactMatch = products.variations.find(v => {
      const woodMatch = v.wood_type === selectedWood;
      const cushionMatch = v.cushion_type === selectedCushioning;
      
      // Check both customized_image_url and image_url fields
      const hasCustomizedImage = v.customized_image_url && v.customized_image_url.trim() !== '';
      const hasImageUrl = v.image_url && v.image_url.trim() !== '';
      const hasImage = hasCustomizedImage || hasImageUrl;
      
      console.log(`6. Checking: ${v.wood_type}+${v.cushion_type} - Wood:${woodMatch}, Cushion:${cushionMatch}, Image:${hasImage}`);
      console.log(`   - customized_image_url: ${hasCustomizedImage ? 'YES' : 'NO'}`);
      console.log(`   - image_url: ${hasImageUrl ? 'YES' : 'NO'}`);
      
      return woodMatch && cushionMatch && hasImage;
    });
    
    if (exactMatch) {
      console.log('7. ✅ EXACT MATCH FOUND! Using custom image');
      
      // Determine which image URL to use
      const imageUrl = exactMatch.customized_image_url && exactMatch.customized_image_url.trim() !== ''
        ? exactMatch.customized_image_url
        : exactMatch.image_url;
      
      console.log('7. Image length:', imageUrl.length);
      console.log('7. Image preview:', imageUrl.substring(0, 50) + '...');
      console.log('7. Image source:', exactMatch.customized_image_url ? 'customized_image_url' : 'image_url');
      
      setDisplayImage(imageUrl);
    } else {
      console.log('7. ❌ No exact match found, using main product image');
      console.log('7. Main image length:', products.mainProduct.image_url?.length || 0);
      setDisplayImage(products.mainProduct.image_url || '');
    }
  }, [selectedWood, selectedCushioning, products]);

  // Set initial display image when product loads - optimized and prioritizing variation image
  useEffect(() => {
    if (!products) return;
    
    const { mainProduct, variations } = products;
    
    if (!mainProduct) return;
    
    console.log('8. Setting initial display image');
    console.log('8. Timestamp:', new Date().toISOString());
    
    // First check if there's a variation that matches the current wood and cushioning
    if (selectedWood && selectedCushioning) {
      const matchingVariation = variations.find(v => {
        const woodMatch = v.wood_type === selectedWood;
        const cushionMatch = v.cushion_type === selectedCushioning;
        
        // Check both customized_image_url and image_url fields
        const hasCustomizedImage = v.customized_image_url && v.customized_image_url.trim() !== '';
        const hasImageUrl = v.image_url && v.image_url.trim() !== '';
        const hasImage = hasCustomizedImage || hasImageUrl;
        
        return woodMatch && cushionMatch && hasImage;
      });
      
      if (matchingVariation) {
        console.log('8. Found matching variation with custom image');
        
        // Determine which image URL to use
        const imageUrl = matchingVariation.customized_image_url && matchingVariation.customized_image_url.trim() !== ''
          ? matchingVariation.customized_image_url
          : matchingVariation.image_url;
        
        console.log('8. Image URL length:', imageUrl.length);
        console.log('8. Image source:', matchingVariation.customized_image_url ? 'customized_image_url' : 'image_url');
        
        setDisplayImage(imageUrl);
        return;
      }
    }
    
    // If no matching variation with image, use main product image
    if (mainProduct.image_url) {
      console.log('8. Using main product image');
      console.log('8. Image URL length:', mainProduct.image_url.length);
      setDisplayImage(mainProduct.image_url);
    }
  }, [products, selectedWood, selectedCushioning]);

  // Initialize wood and cushioning selection from main product
  useEffect(() => {
    if (products?.mainProduct) {
      // Only set on first load (not on every products change)
      setSelectedWood(prev => prev ?? products.mainProduct.wood_type ?? "");
      setSelectedCushioning(prev => prev ?? products.mainProduct.cushion_type ?? "");
    }
  }, [products]);

  // Enhanced error handling and loading states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Navigation />
        <div className="animate-pulse text-lg text-muted-foreground">Loading product data...</div>
      </div>
    );
  }

  if (queryError) {
    console.error('Product query error:', queryError);
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center max-w-md p-6 bg-card rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Error Loading Product</h2>
            <p className="text-muted-foreground mb-4">There was a problem loading the product data.</p>
            <p className="text-sm text-red-500 mb-4">
              {queryError instanceof Error ? queryError.message : "Unknown error occurred"}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!products || !products.mainProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Product not found</h2>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const { mainProduct, variations } = products;
  
  // Find the variation that matches selected options or fall back to main product
  const currentVariant = variations.find(v => 
    v.wood_type === selectedWood && v.cushion_type === selectedCushioning
  ) || mainProduct;

  // Product images - always using the main product images, not the variation images
  let galleryImages: string[] = [];
  const isDefaultVariation = currentVariant.is_main_variant;
  if (isDefaultVariation) {
    // Always show main image first for default variation
    galleryImages = [
      mainProduct.image_url,
      mainProduct.view1_image_url,
      mainProduct.view2_image_url,
      mainProduct.view3_image_url,
      mainProduct.view4_image_url,
    ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);
  } else {
    // For other variations, show their image first if available
    let variationImage = "";
    if (currentVariant && currentVariant.customized_image_url && currentVariant.customized_image_url.trim() !== "") {
      variationImage = currentVariant.customized_image_url;
    } else if (currentVariant && currentVariant.image_url && currentVariant.image_url.trim() !== "") {
      variationImage = currentVariant.image_url;
    }
    galleryImages = [
      variationImage,
      mainProduct.image_url,
      mainProduct.view1_image_url,
      mainProduct.view2_image_url,
      mainProduct.view3_image_url,
      mainProduct.view4_image_url,
    ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const nextImage = () => {
  setSelectedImage(prev => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
  setSelectedImage(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
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
    { name: 'Shell', value: 'shell', description: 'Firm structural support' },
    { name: 'Mango', value: 'mango', description: 'Natural fruit fiber cushioning' }
  ];

  // Helper function to check if variation has image
  const hasVariationImage = (wood: string, cushion: string) => {
    console.log(`=== CHECKING VARIATION IMAGE FOR UI ===`);
    console.log(`9. Looking for: ${wood}+${cushion}`);
    
    const variation = products?.variations?.find(v => {
      const match = v.wood_type === wood && v.cushion_type === cushion;
      
      // Check both customized_image_url and image_url fields
      const hasCustomizedImage = v.customized_image_url && v.customized_image_url.trim() !== '';
      const hasImageUrl = v.image_url && v.image_url.trim() !== '';
      const hasImage = hasCustomizedImage || hasImageUrl;
      
      console.log(`10. Check ${v.wood_type}+${v.cushion_type}: match=${match}, hasImage=${hasImage}`);
      console.log(`   - customized_image_url: ${hasCustomizedImage ? 'YES' : 'NO'}`);
      console.log(`   - image_url: ${hasImageUrl ? 'YES' : 'NO'}`);
      
      return match && hasImage;
    });
    
    const result = !!variation;
    console.log(`10. Final result for ${wood}+${cushion}: ${result ? 'HAS IMAGE' : 'NO IMAGE'}`);
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Product Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            
            {/* Left - Image Gallery */}
            <div className="space-y-6">
              {/* Main Image Display */}
              <div className="relative group">
                <div className="aspect-[4/3] bg-card rounded-2xl overflow-hidden shadow-elegant">
                  {galleryImages.length > 0 && (
                    <>
                      <Dialog>
                        <DialogTrigger className="w-full h-full">
                          <img 
                            src={galleryImages[selectedImage]}
                            alt={mainProduct.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl p-2">
                          <img 
                            src={galleryImages[selectedImage]}
                            alt={mainProduct.name}
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                      
                      {/* Navigation Arrows */}
                      {galleryImages.length > 1 && (
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
                {galleryImages.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {galleryImages.map((image, index) => (
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
                    ₹{safeParsePrice(currentVariant.price).toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{(safeParsePrice(currentVariant.price) * 1.2).toLocaleString()}
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
                  {/* Quantity option moved to customization section */}

                  {/* Contact button moved to below customization section */}
                </div>
              </Card>
            </div>
          </div>

          {/* Customization Section - Updated Layout */}
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Customized Preview - Takes 5 columns */}
                <div className="lg:col-span-5">
                  <div className="sticky top-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">Your Configuration</h3>
                    <div className="aspect-square bg-muted/30 rounded-2xl overflow-hidden shadow-elegant">
                      {hasVariationImage(selectedWood, selectedCushioning) ? (
                        <img
                          src={displayImage}
                          alt="Customized view"
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-muted/50 to-muted/20">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📷</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">
                            This combination will be available soon
                          </p>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Customization Preview
                      </div>
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
                          <span className="font-bold text-primary">₹{safeParsePrice(currentVariant.price).toLocaleString()}</span>
                        </div>
                        {!hasVariationImage(selectedWood, selectedCushioning) && (
                          <div className="text-xs text-orange-600 pt-2 border-t">
                            This combination is not currently available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options Container - Takes 7 columns */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Wood Selection */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">Wood Selection</h3>
                      <p className="text-muted-foreground mb-4">Choose your preferred wood type</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {woodOptions.map((wood) => (
                        <button
                          key={wood.value}
                          onClick={() => setSelectedWood(wood.value)}
                          className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                            selectedWood === wood.value
                              ? 'border-primary bg-primary/5 shadow-md scale-105'
                              : 'border-border hover:border-primary/50 hover:shadow-sm'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden mb-1">
                            <img
                              src={`/assets/wood/${wood.value}.png`}
                              alt={wood.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h5 className="font-medium text-xs text-center">{wood.name}</h5>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cushioning Options */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">Cushioning</h3>
                      <p className="text-muted-foreground mb-4">Select your preferred comfort level</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {cushioningOptions.map((cushion) => (
                        <button
                          key={cushion.value}
                          onClick={() => setSelectedCushioning(cushion.value)}
                          className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                            selectedCushioning === cushion.value
                              ? 'border-primary bg-primary/5 shadow-md scale-105'
                              : 'border-border hover:border-primary/50 hover:shadow-sm'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden mb-1">
                            <img
                              src={`/assets/cushion/${cushion.value}.png`}
                              alt={cushion.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h5 className="font-medium text-xs text-center">{cushion.name}</h5>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quantity Selector - Added above Contact button */}
                  <div className="flex items-center justify-between bg-background/50 rounded-lg p-4 mt-6 mb-4">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center border rounded-lg bg-background">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity === 1}
                        className="rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-1 min-w-[3rem] text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        className="rounded-r-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Contact for Custom Order Button */}
                  <Button
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                    onClick={() => setIsContactFormOpen(true)}
                  >
                    Contact for Custom Order
                  </Button>
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
