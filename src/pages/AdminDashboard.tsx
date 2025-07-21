import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getThemeNames, getCategoryNames } from '@/data/furnitureData';
import { Upload, Package, Settings, Plus, Image, Sparkles, Palette, Grid, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProducts } from "@/hooks/useProducts";
import { OrdersTab } from "@/components/OrdersTab";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('post');
  const [loading, setLoading] = useState(false);
  const { products, refetch } = useProducts();

  // Form states for furniture card
  const [cardData, setCardData] = useState({
    name: '',
    price: '',
    product_number: '',
    theme: '',
    category: '',
    image_url: ''
  });

  // Form states for product page
  const [productData, setProductData] = useState({
    name: '',
    product_number: '',
    description: '',
    view1_image_url: '',
    view2_image_url: '',
    view3_image_url: '',
    view4_image_url: '',
    wood_type: '',
    cushion_type: '',
    customized_image_url: '',
    price: '',
    is_main_variant: false,
    variation_count: 1
  });

  // New states for variation images
  const [variationImages, setVariationImages] = useState<{[key: string]: {file: File | null, preview: string}}>({});

  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState<string>('');
  
  const [viewImages, setViewImages] = useState({
    view1: { file: null as File | null, preview: '' },
    view2: { file: null as File | null, preview: '' },
    view3: { file: null as File | null, preview: '' },
    view4: { file: null as File | null, preview: '' }
  });
  
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string>('');

  const themes = getThemeNames();
  const categories = getCategoryNames();

  // Wood and cushioning options
  const woodOptions = ['teak', 'walnut', 'pine', 'mango', 'plywood'];
  const cushionOptions = ['polyester', 'foam', 'down', 'cotton', 'shell'];

  // Generate unique product number
  const generateProductNumber = async () => {
    let isUnique = false;
    let productNumber = '';
    
    while (!isUnique) {
      // Generate a random product number in format FRN-XXXX
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      productNumber = `FRN-${randomNum}`;
      
      // Check if this number already exists
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('product_number', productNumber)
        .limit(1);
      
      if (error) {
        console.error('Error checking product number:', error);
        break;
      }
      
      if (!data || data.length === 0) {
        isUnique = true;
      }
    }
    
    setCardData(prev => ({ ...prev, product_number: productNumber }));
    toast({
      title: "Product Number Generated",
      description: `Generated unique product number: ${productNumber}`,
    });
  };

  // Check if product number exists
  const checkProductNumber = async (productNumber: string) => {
    if (!productNumber) return false;
    
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('product_number', productNumber)
      .limit(1);
    
    if (error) {
      console.error('Error checking product number:', error);
      return false;
    }
    
    return data && data.length > 0;
  };

  // Generate variation combinations
  const generateVariationCombinations = () => {
    const combinations: Array<{wood: string, cushion: string, key: string}> = [];
    woodOptions.forEach(wood => {
      cushionOptions.forEach(cushion => {
        combinations.push({
          wood,
          cushion,
          key: `${wood}_${cushion}`
        });
      });
    });
    return combinations;
  };

  // Handle variation image upload
  const handleVariationImageChange = (variationKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setVariationImages(prev => ({
          ...prev,
          [variationKey]: { file, preview: result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Card image handler
  const handleCardImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCardImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCardImagePreview(result);
        setCardData({...cardData, image_url: result});
      };
      reader.readAsDataURL(file);
    }
  };

  // View images handler
  const handleViewImageChange = (viewNumber: 'view1' | 'view2' | 'view3' | 'view4', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setViewImages(prev => ({
          ...prev,
          [viewNumber]: { file, preview: result }
        }));
        setProductData(prev => ({
          ...prev,
          [`${viewNumber}_image_url`]: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom image handler
  const handleCustomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomImagePreview(result);
        setProductData({...productData, customized_image_url: result});
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit furniture card (main variant)
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if product number already exists
      const exists = await checkProductNumber(cardData.product_number);
      if (exists) {
        toast({
          title: "Product Number Already Exists",
          description: "This product number is already in use. Please use a different number or generate a new one.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('products')
        .insert([{
          name: cardData.name,
          price: parseFloat(cardData.price),
          product_number: cardData.product_number,
          theme: cardData.theme,
          category: cardData.category,
          image_url: cardData.image_url,
          description: '',
          view1_image_url: '',
          view2_image_url: '',
          view3_image_url: '',
          view4_image_url: '',
          wood_type: '',
          cushion_type: '',
          customized_image_url: '',
          is_main_variant: true
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Product Number Already Exists",
            description: "This product number is already in use. Please use a different number.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Main Product Created",
        description: "Main product variant has been added successfully",
      });

      // Reset card form
      setCardData({
        name: '',
        price: '',
        product_number: '',
        theme: '',
        category: '',
        image_url: ''
      });
      setCardImageFile(null);
      setCardImagePreview('');
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit product variations (bulk create all combinations)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find the main product
      const selectedMainProduct = products.find(p => 
        p.name === productData.name && p.product_number === productData.product_number
      );

      if (!selectedMainProduct) {
        throw new Error("Please create the main product first before adding variations");
      }

      // Create all variations (including those without images)
      const variations = generateVariationCombinations();
      const variationsToInsert = [];

      for (const variation of variations) {
        const variationImage = variationImages[variation.key];
        
        // Insert variation even if no image is uploaded (will use placeholder on frontend)
        variationsToInsert.push({
          name: productData.name,
          price: parseFloat(productData.price),
          product_number: productData.product_number,
          theme: selectedMainProduct.theme,
          category: selectedMainProduct.category,
          image_url: variationImage?.preview || '', // Empty string if no image
          description: productData.description,
          view1_image_url: productData.view1_image_url,
          view2_image_url: productData.view2_image_url,
          view3_image_url: productData.view3_image_url,
          view4_image_url: productData.view4_image_url,
          wood_type: variation.wood,
          cushion_type: variation.cushion,
          customized_image_url: variationImage?.preview || '', // Empty string if no image
          is_main_variant: false
        });
      }

      const { error } = await supabase
        .from('products')
        .insert(variationsToInsert);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Duplicate Product Found",
            description: "Some variations already exist. Please check your product data.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Product Variations Created",
        description: `${variationsToInsert.length} product variations have been created`,
      });

      // Reset forms
      setProductData({
        name: '',
        product_number: '',
        description: '',
        view1_image_url: '',
        view2_image_url: '',
        view3_image_url: '',
        view4_image_url: '',
        wood_type: '',
        cushion_type: '',
        customized_image_url: '',
        price: '',
        is_main_variant: false,
        variation_count: 1
      });
      setViewImages({
        view1: { file: null, preview: '' },
        view2: { file: null, preview: '' },
        view3: { file: null, preview: '' },
        view4: { file: null, preview: '' }
      });
      setVariationImages({});
      setCustomImageFile(null);
      setCustomImagePreview('');
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const mainProducts = products.filter(p => p.name && p.product_number);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-serif text-foreground">Admin Studio</h1>
              </div>
              <nav className="flex space-x-1">
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('orders')}
                  className="px-6"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === 'feedback' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('feedback')}
                  className="px-6"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Feedback
                </Button>
                <Button
                  variant={activeTab === 'post' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('post')}
                  className="px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </nav>
            </div>
            <Button onClick={signOut} variant="outline" className="px-6">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'orders' && (
          <OrdersTab />
        )}

        {activeTab === 'feedback' && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/20 to-secondary/30">
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Customer Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-muted-foreground">Feedback analytics and management tools coming soon...</p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'post' && (
          <div className="space-y-8">
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Grid className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Step 1: Create Main Product</CardTitle>
                    <p className="text-muted-foreground mt-1">Create the main product that will appear in theme and category pages</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleCardSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Main Product Image</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCardImageChange}
                        className="hidden"
                        id="card-image-upload"
                        required
                      />
                      <Label htmlFor="card-image-upload" className="cursor-pointer">
                        <div className="space-y-3">
                          {cardImagePreview ? (
                            <img 
                              src={cardImagePreview} 
                              alt="Preview" 
                              className="h-32 w-32 object-cover rounded-lg mx-auto shadow-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {cardImagePreview ? 'Click to change image' : 'Upload main product image'}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Product Name</Label>
                      <Input
                        id="card-name"
                        type="text"
                        placeholder="Elegant Modern Chair"
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value})}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Product Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="card-number"
                          type="text"
                          placeholder="FRN-001"
                          value={cardData.product_number}
                          onChange={(e) => setCardData({...cardData, product_number: e.target.value})}
                          className="h-12 flex-1"
                          required
                        />
                        <Button
                          type="button"
                          onClick={generateProductNumber}
                          variant="outline"
                          className="h-12 px-4"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Click the refresh button to generate a unique product number</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-theme">Theme</Label>
                      <Select
                        value={cardData.theme}
                        onValueChange={(value) => setCardData({...cardData, theme: value})}
                        required
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(themes).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-category">Category</Label>
                      <Select
                        value={cardData.category}
                        onValueChange={(value) => setCardData({...cardData, category: value})}
                        required
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categories).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="card-price">Base Price (₹)</Label>
                      <Input
                        id="card-price"
                        type="number"
                        step="0.01"
                        placeholder="25,000.00"
                        value={cardData.price}
                        onChange={(e) => setCardData({...cardData, price: e.target.value})}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                    <Plus className="w-5 h-5 mr-2" />
                    {loading ? 'Creating Main Product...' : 'Create Main Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Step 2: Add Product Variations</CardTitle>
                    <p className="text-muted-foreground mt-1">Upload images for different wood and cushioning combinations</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleProductSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Select Existing Product</Label>
                      <Select
                        value={`${productData.name}|${productData.product_number}`}
                        onValueChange={(value) => {
                          const [name, product_number] = value.split('|');
                          setProductData({...productData, name, product_number});
                        }}
                        required
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Choose a main product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mainProducts.map((product) => (
                            <SelectItem key={product.id} value={`${product.name}|${product.product_number}`}>
                              {product.name} ({product.product_number})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Variation Price (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="25,000.00"
                        value={productData.price}
                        onChange={(e) => setProductData({...productData, price: e.target.value})}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        placeholder="Product description..."
                        value={productData.description}
                        onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Product View Images (Common for all variations)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['view1', 'view2', 'view3', 'view4'].map((view, index) => (
                        <div key={view} className="space-y-2">
                          <div className="aspect-square border-2 border-dashed border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleViewImageChange(view as 'view1' | 'view2' | 'view3' | 'view4', e)}
                              className="hidden"
                              id={`${view}-upload`}
                            />
                            <Label htmlFor={`${view}-upload`} className="cursor-pointer h-full flex items-center justify-center">
                              {viewImages[view as keyof typeof viewImages].preview ? (
                                <img 
                                  src={viewImages[view as keyof typeof viewImages].preview} 
                                  alt={`View ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center p-4">
                                  <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-xs text-muted-foreground">View {index + 1}</p>
                                </div>
                              )}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="text-center">
                      <Label className="text-xl font-semibold">Customization Variation Images</Label>
                      <p className="text-muted-foreground mt-2">Upload images for each wood type and cushioning combination</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total combinations: {woodOptions.length} wood types × {cushionOptions.length} cushioning types = {woodOptions.length * cushionOptions.length} variations
                      </p>
                      <p className="text-xs text-orange-600 mt-2">
                        Note: Variations without images will show placeholder text for customers
                      </p>
                    </div>

                    <div className="space-y-8">
                      {woodOptions.map((wood) => (
                        <div key={wood} className="space-y-4">
                          <h3 className="text-lg font-semibold capitalize border-b pb-2">{wood} Wood Variations</h3>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {cushionOptions.map((cushion) => {
                              const variationKey = `${wood}_${cushion}`;
                              return (
                                <div key={variationKey} className="space-y-2">
                                  <div className="aspect-square border-2 border-dashed border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleVariationImageChange(variationKey, e)}
                                      className="hidden"
                                      id={`variation-${variationKey}`}
                                    />
                                    <Label htmlFor={`variation-${variationKey}`} className="cursor-pointer h-full flex items-center justify-center">
                                      {variationImages[variationKey]?.preview ? (
                                        <img 
                                          src={variationImages[variationKey].preview} 
                                          alt={`${wood} with ${cushion}`} 
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="text-center p-2">
                                          <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                                        </div>
                                      )}
                                    </Label>
                                  </div>
                                  <p className="text-xs text-center text-muted-foreground capitalize">
                                    {wood} + {cushion}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base" disabled={loading || !productData.name}>
                    <Plus className="w-5 h-5 mr-2" />
                    {loading ? 'Creating Variations...' : 'Create All Product Variations'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
