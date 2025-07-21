import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { ContactFormDialog } from "@/components/ContactFormDialog";

const ProductPage = () => {
  const { productName } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWood, setSelectedWood] = useState("teak");
  const [selectedCushioning, setSelectedCushioning] = useState("polyester");
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Fetch product and its variations
  const { data: products, isLoading } = useQuery({
    queryKey: ['product', productName, selectedWood, selectedCushioning],
    queryFn: async () => {
      if (!productName) return null;
      
      const decodedName = decodeURIComponent(productName);
      
      // First get the main product (is_main_variant = true)
      const { data: mainProduct, error: mainError } = await supabase
        .from('products')
        .select('*')
        .eq('name', decodedName)
        .eq('is_main_variant', true)
        .single();
      
      if (mainError) throw mainError;
      
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!products || !products.mainProduct) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const { mainProduct, variations } = products;
  
  // Find the variation that matches selected options or fall back to main product
  const currentVariant = variations.find(v => 
    v.wood_type === selectedWood && v.cushion_type === selectedCushioning
  ) || mainProduct;

  // Product images - using the view images from the current variant
  const productImages = [
    currentVariant.customized_image_url,
    currentVariant.view1_image_url,
    currentVariant.view2_image_url,
    currentVariant.view3_image_url,
    currentVariant.view4_image_url,
  ].filter(Boolean);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const woodOptions = [
    { name: 'Teak', value: 'teak' },
    { name: 'Walnut', value: 'walnut' },
    { name: 'Pine', value: 'pine' },
    { name: 'Mango', value: 'mango' },
    { name: 'Plywood', value: 'plywood' }
  ];

  const cushioningOptions = [
    { name: 'Polyester', value: 'polyester' },
    { name: 'Foam', value: 'foam' },
    { name: 'Cotton', value: 'cotton' },
    { name: 'Shell', value: 'shell' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          
          {/* Left Side - Product Images */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{mainProduct.name}</h1>
              <p className="text-muted-foreground text-lg">Code: {mainProduct.product_number}</p>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-foreground">₹{currentVariant.price?.toLocaleString()}</span>
            </div>

            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {mainProduct.description || "Experience exceptional craftsmanship with this beautiful piece of furniture. Each item is carefully crafted with attention to detail and premium materials."}
              </p>
            </div>

            {/* Main Product Image and Grid */}
            <div className="space-y-4">
              {productImages.length > 0 && (
                <>
                  {/* Main Image */}
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                    <Dialog>
                      <DialogTrigger className="w-full h-full">
                        <img 
                          src={productImages[selectedImage]} 
                          alt={mainProduct.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <img 
                          src={productImages[selectedImage]} 
                          alt={mainProduct.name}
                          className="w-full h-auto"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Thumbnail Grid */}
                  {productImages.length > 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      {productImages.slice(1, 4).map((image, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setSelectedImage(index + 1)}
                          className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index + 1 
                              ? 'border-primary' 
                              : 'border-transparent hover:border-muted-foreground/30'
                          }`}
                        >
                          <img 
                            src={image} 
                            alt={`View ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Side - Customization and Order */}
          <div className="space-y-8">
            {/* Large Customized Image */}
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img 
                src={currentVariant.customized_image_url || currentVariant.image_url} 
                alt="Customized view"
                className="w-full h-full object-cover"
              />
              {!currentVariant.customized_image_url && (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">Coming Soon</span>
                </div>
              )}
            </div>

            {/* Customization Options - Small beside the image */}
            <div className="flex gap-8">
              {/* Wood Selection */}
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Wood Selection</h3>
                <div className="space-y-2">
                  {woodOptions.map((wood) => (
                    <button
                      key={wood.value}
                      onClick={() => setSelectedWood(wood.value)}
                      className={`flex items-center gap-2 p-2 text-xs rounded-md border transition-all ${
                        selectedWood === wood.value
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-amber-200 to-amber-600 rounded"></div>
                      {wood.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cushioning Options */}
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Cushioning Options</h3>
                <div className="space-y-2">
                  {cushioningOptions.map((cushion) => (
                    <button
                      key={cushion.value}
                      onClick={() => setSelectedCushioning(cushion.value)}
                      className={`flex items-center gap-2 p-2 text-xs rounded-md border transition-all ${
                        selectedCushioning === cushion.value
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-blue-200 to-blue-400 rounded"></div>
                      {cushion.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Card className="p-6">
              {/* Quantity Selector */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
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
              </div>

              {/* Contact Button */}
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-semibold"
                onClick={() => setIsContactFormOpen(true)}
              >
                Contact for Custom Order
              </Button>
            </Card>
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