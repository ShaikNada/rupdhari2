import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
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

  const safeParsePrice = (price: string | number | null | undefined): number => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const parsed = parseFloat(String(price));
    return isNaN(parsed) ? 0 : parsed;
  };

  const { data: products, isLoading, error: queryError } = useQuery({
    queryKey: ['product', productName],
    queryFn: async () => {
      if (!productName) return null;
      const decodedName = decodeURIComponent(productName);
      const { data: mainProduct } = await supabase
        .from('products')
        .select('*')
        .eq('name', decodedName)
        .eq('is_main_variant', true)
        .maybeSingle();
      if (!mainProduct) return null;
      const { data: allVariations } = await supabase
        .from('products')
        .select('*')
        .eq('product_number', mainProduct.product_number)
        .eq('is_main_variant', false);
      return {
        mainProduct: {
          ...mainProduct,
          price: typeof mainProduct.price === 'string' ? parseFloat(mainProduct.price) || 0 : mainProduct.price || 0
        },
        variations: allVariations?.map(v => ({
          ...v,
          price: typeof v.price === 'string' ? parseFloat(v.price) || 0 : v.price || 0
        })) || []
      };
    },
  });

  useEffect(() => {
    if (!products || !products.variations || !products.mainProduct) return;
    const exactMatch = products.variations.find(v =>
      v.wood_type === selectedWood &&
      v.cushion_type === selectedCushioning &&
      (v.customized_image_url?.trim() || v.image_url?.trim())
    );
    if (exactMatch) {
      setDisplayImage(
        exactMatch.customized_image_url?.trim() || exactMatch.image_url || ''
      );
    } else {
      setDisplayImage(products.mainProduct.image_url || '');
    }
  }, [selectedWood, selectedCushioning, products]);

  useEffect(() => {
    if (products?.mainProduct) {
      setSelectedWood(prev => prev ?? products.mainProduct.wood_type ?? "");
      setSelectedCushioning(prev => prev ?? products.mainProduct.cushion_type ?? "");
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Navigation />
        <div className="animate-pulse text-lg text-muted-foreground">Loading product data...</div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center max-w-md p-6 bg-card rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Error Loading Product</h2>
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
          </div>
        </div>
      </div>
    );
  }

  const { mainProduct, variations } = products;
  const currentVariant = variations.find(v =>
    v.wood_type === selectedWood && v.cushion_type === selectedCushioning
  ) || mainProduct;

  let galleryImages: string[] = [];
  if (currentVariant.customized_image_url?.trim()) {
    galleryImages.push(currentVariant.customized_image_url);
  }
  [mainProduct.image_url, mainProduct.view1_image_url, mainProduct.view2_image_url, mainProduct.view3_image_url, mainProduct.view4_image_url]
    .filter(img => img && !galleryImages.includes(img))
    .forEach(img => galleryImages.push(img));

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const nextImage = () => setSelectedImage(prev => (prev + 1) % galleryImages.length);
  const prevImage = () => setSelectedImage(prev => (prev - 1 + galleryImages.length) % galleryImages.length);

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
    { name: 'Down', value: 'down' },
    { name: 'Cotton', value: 'cotton' },
    { name: 'Shell', value: 'shell' },
    { name: 'None', value: 'None' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            <div className="space-y-6">
              <div className="relative group">
                <div className="aspect-[4/3] max-w-[85%] mx-auto bg-card rounded-xl overflow-hidden shadow-elegant">
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
                      {galleryImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex justify-center gap-3 mt-4">
                    {galleryImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-primary shadow-lg scale-105'
                            : 'border-transparent hover:border-muted-foreground/30'
                        }`}
                      >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <Badge variant="secondary" className="px-3 py-1">{mainProduct.product_number}</Badge>
              <h1 className="text-4xl lg:text-5xl font-serif text-foreground leading-tight">{mainProduct.name}</h1>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-primary">
                  ₹{safeParsePrice(currentVariant.price).toLocaleString()}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ₹{(safeParsePrice(currentVariant.price) * 1.2).toLocaleString()}
                </span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Save 20%</Badge>
              </div>
              {mainProduct.description && (
                <p className="text-muted-foreground leading-relaxed text-lg">{mainProduct.description}</p>
              )}
            </div>
          </div>
          <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-luxury">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-serif text-center mb-8">Customize Your Piece</h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                  <div className="sticky top-8">
                    <div className="aspect-square bg-muted/30 rounded-2xl overflow-hidden shadow-elegant">
                      <img
                        src={displayImage || products?.mainProduct?.image_url || ''}
                        alt="Customized view"
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>
                    <div className="mt-4 p-4 bg-background/50 rounded-xl">
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
                        <span className="font-bold text-primary">
                          ₹{safeParsePrice(currentVariant.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Wood Selection</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {woodOptions.map((wood) => (
                        <button
                          key={wood.value}
                          onClick={() => setSelectedWood(wood.value)}
                          className={`flex flex-col items-center p-1 rounded-lg border-2 transition-all ${
                            selectedWood === wood.value
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden mb-1">
                            <img src={`/assets/wood/${wood.value}.png`} alt={wood.name} className="w-full h-full object-cover" />
                          </div>
                          <h5 className="font-medium text-xs text-center">{wood.name}</h5>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cushioning</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {cushioningOptions.map((cushion) => (
                        <button
                          key={cushion.value}
                          onClick={() => setSelectedCushioning(cushion.value)}
                          className={`flex flex-col items-center p-1 rounded-lg border-2 transition-all ${
                            selectedCushioning === cushion.value
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden mb-1">
                            <img src={`/assets/cushion/${cushion.value}.png`} alt={cushion.name} className="w-full h-full object-cover" />
                          </div>
                          <h5 className="font-medium text-xs text-center">{cushion.name}</h5>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
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
