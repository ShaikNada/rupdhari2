
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getThemeNames, getCategoryNames } from '@/data/furnitureData';
import { Upload, Package, Settings, Plus, Image, Sparkles, Grid, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { OrdersTab } from "@/components/OrdersTab";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('post');
  const [loading, setLoading] = useState(false);
  const { products, refetch } = useProducts();

  // Combined form state for complete product creation
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    product_number: '',
    theme: '',
    category: '',
    image_url: '',
    description: '',
    view1_image_url: '',
    view2_image_url: '',
    view3_image_url: '',
    view4_image_url: '',
  });

  // Main product image
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  
  // View images
  const [viewImages, setViewImages] = useState({
    view1: { file: null as File | null, preview: '' },
    view2: { file: null as File | null, preview: '' },
    view3: { file: null as File | null, preview: '' },
    view4: { file: null as File | null, preview: '' }
  });

  // Variation images
  const [variationImages, setVariationImages] = useState<{[key: string]: {file: File | null, preview: string}}>({});

  const themes = getThemeNames();
  const categories = getCategoryNames();

  // Wood and cushioning options
  const woodOptions = ['teak', 'walnut', 'pine', 'mango', 'plywood'];
  const cushionOptions = ['polyester', 'foam', 'down', 'cotton', 'shell', 'mango'];

  // Generate unique product number
  const generateProductNumber = async () => {
    let isUnique = false;
    let productNumber = '';
    
    while (!isUnique) {
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      productNumber = `FRN-${randomNum}`;
      
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('product_number', productNumber)
        .eq('is_main_variant', true)
        .limit(1);
      
      if (error) {
        console.error('Error checking product number:', error);
        break;
      }
      
      if (!data || data.length === 0) {
        isUnique = true;
      }
    }
    
    setProductData(prev => ({ ...prev, product_number: productNumber }));
    toast({
      title: "Product Number Generated",
      description: `Generated unique product number: ${productNumber}`,
    });
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

  // Handle main image upload
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMainImagePreview(result);
        setProductData(prev => ({...prev, image_url: result}));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle view images
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

  // Handle variation image upload
  const handleVariationImageChange = (variationKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log(`=== VARIATION IMAGE UPLOAD DEBUG ===`);
        console.log(`Variation key: ${variationKey}`);
        console.log(`Image preview set:`, result.substring(0, 100) + '...');
        
        setVariationImages(prev => ({
          ...prev,
          [variationKey]: { file, preview: result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit complete product with all variations
  const handleCompleteProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('=== PRODUCT SUBMISSION DEBUG ===');
      console.log('Variation images state:', Object.keys(variationImages).length);
      
      // Check if product number already exists for main variants
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('product_number', productData.product_number)
        .eq('is_main_variant', true)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (existingProduct && existingProduct.length > 0) {
        toast({
          title: "Product Number Already Exists",
          description: "This product number is already in use. Please generate a new one.",
          variant: "destructive",
        });
        return;
      }

      // Create main product
      const { error: mainError } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: parseFloat(productData.price),
          product_number: productData.product_number,
          theme: productData.theme,
          category: productData.category,
          image_url: productData.image_url,
          description: productData.description,
          view1_image_url: productData.view1_image_url,
          view2_image_url: productData.view2_image_url,
          view3_image_url: productData.view3_image_url,
          view4_image_url: productData.view4_image_url,
          wood_type: null,
          cushion_type: null,
          customized_image_url: '',
          is_main_variant: true
        }]);

      if (mainError) {
        throw mainError;
      }

      console.log('✅ Main product created successfully');

      // Create all variations
      const variations = generateVariationCombinations();
      const variationsToInsert = variations.map(variation => {
        const variationImage = variationImages[variation.key];
        const customizedImageUrl = variationImage?.preview || '';
        
        console.log(`Creating variation: ${variation.wood} + ${variation.cushion}`);
        console.log(`Has custom image: ${!!customizedImageUrl}`);
        if (customizedImageUrl) {
          console.log(`Image data length: ${customizedImageUrl.length}`);
        }
        
        return {
          name: productData.name,
          price: parseFloat(productData.price),
          product_number: productData.product_number,
          theme: productData.theme,
          category: productData.category,
          image_url: productData.image_url, // Keep main image as fallback
          description: productData.description,
          view1_image_url: productData.view1_image_url,
          view2_image_url: productData.view2_image_url,
          view3_image_url: productData.view3_image_url,
          view4_image_url: productData.view4_image_url,
          wood_type: variation.wood,
          cushion_type: variation.cushion,
          customized_image_url: customizedImageUrl,
          is_main_variant: false
        };
      });

      console.log(`Inserting ${variationsToInsert.length} variations`);
      console.log('Variations with images:', variationsToInsert.filter(v => v.customized_image_url).length);

      const { error: variationsError } = await supabase
        .from('products')
        .insert(variationsToInsert);

      if (variationsError) {
        console.error('Variations error:', variationsError);
        throw variationsError;
      }

      console.log('✅ All variations created successfully');

      toast({
        title: "Product Created Successfully",
        description: `Created main product with ${variationsToInsert.length} variations`,
      });

      // Reset form
      setProductData({
        name: '',
        price: '',
        product_number: '',
        theme: '',
        category: '',
        image_url: '',
        description: '',
        view1_image_url: '',
        view2_image_url: '',
        view3_image_url: '',
        view4_image_url: '',
      });
      setMainImageFile(null);
      setMainImagePreview('');
      setViewImages({
        view1: { file: null, preview: '' },
        view2: { file: null, preview: '' },
        view3: { file: null, preview: '' },
        view4: { file: null, preview: '' }
      });
      setVariationImages({});
      refetch();
    } catch (error: any) {
      console.error('Product creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Grid className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Create Complete Product</CardTitle>
                  <p className="text-muted-foreground mt-1">Create product with all variations in one go</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleCompleteProductSubmit} className="space-y-8">
                {/* Basic Product Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Main Product Image</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                        id="main-image-upload"
                        required
                      />
                      <Label htmlFor="main-image-upload" className="cursor-pointer">
                        <div className="space-y-3">
                          {mainImagePreview ? (
                            <img 
                              src={mainImagePreview} 
                              alt="Preview" 
                              className="h-32 w-32 object-cover rounded-lg mx-auto shadow-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {mainImagePreview ? 'Click to change image' : 'Upload main product image'}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Elegant Modern Chair"
                        value={productData.name}
                        onChange={(e) => setProductData({...productData, name: e.target.value})}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-number">Product Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="product-number"
                          type="text"
                          placeholder="FRN-001"
                          value={productData.product_number}
                          onChange={(e) => setProductData({...productData, product_number: e.target.value})}
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={productData.theme}
                        onValueChange={(value) => setProductData({...productData, theme: value})}
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
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={productData.category}
                        onValueChange={(value) => setProductData({...productData, category: value})}
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
                    <div className="space-y-2">
                      <Label htmlFor="price">Base Price (₹)</Label>
                      <Input
                        id="price"
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
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        placeholder="Product description..."
                        value={productData.description}
                        onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Product View Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product View Images</h3>
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

                {/* Variation Images */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Customization Variation Images</h3>
                    <p className="text-muted-foreground mt-2">Upload images for each wood type and cushioning combination</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total combinations: {woodOptions.length} × {cushionOptions.length} = {woodOptions.length * cushionOptions.length} variations
                    </p>
                    <Badge variant="outline" className="mt-2">
                      Optional: Variations without images will show placeholder
                    </Badge>
                  </div>

                  <div className="space-y-8">
                    {woodOptions.map((wood) => (
                      <div key={wood} className="space-y-4">
                        <h4 className="text-lg font-semibold capitalize border-b pb-2">{wood} Wood Variations</h4>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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

                <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                  <Plus className="w-5 h-5 mr-2" />
                  {loading ? 'Creating Complete Product...' : 'Create Complete Product with All Variations'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
