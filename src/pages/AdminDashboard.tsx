// src/pages/AdminDashboard.tsx

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getThemeNames, getCategoryNames } from '@/data/furnitureData';
import { Upload, Package, Settings, Plus, Image, Sparkles, Grid, RefreshCw, Layers, MessageSquare, Trash2, Mail, MailOpen, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { OrdersTab } from "@/components/OrdersTab";
import ProjectsTab from "@/components/ProjectsTab";
import { FeedbackTab } from "@/components/FeedbackTab";
import { formatDistanceToNow } from 'date-fns';

// Type definition for a feedback item from the database
type FeedbackItem = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
};

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const { products, refetch } = useProducts();
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    name: string;
    price: string;
    product_number: string;
    theme: string;
    category: string;
    image_url: string;
    description: string;
    wood_type: string;
    cushion_type: string;
    is_main_variant: boolean;
  } | null>(null);

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

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  
  const [viewImages, setViewImages] = useState({
    view1: { file: null as File | null, preview: '' },
    view2: { file: null as File | null, preview: '' },
    view3: { file: null as File | null, preview: '' },
    view4: { file: null as File | null, preview: '' }
  });

  const [variationData, setVariationData] = useState<{[key: string]: {file: File | null, preview: string, price: string}}>({});
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedCushion, setSelectedCushion] = useState<string>('');

  const themes = getThemeNames();
  const categories = getCategoryNames();
  const woodOptions = ['teak', 'walnut', 'pine', 'mango', 'plywood'];
  const cushionOptions = ['polyester', 'foam', 'down', 'cotton', 'shell', 'none'];

  // --- START OF FEEDBACK TAB LOGIC ---

  // State for the feedback tab
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'unread' | 'read'>('unread');
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<number | null>(null);

  // This is the function you asked for, used to get messages from the database
  const fetchFeedback = useCallback(async () => {
    setFeedbackLoading(true);
    try {
      let query = supabase
        .from('feedback') // Fetches data FROM the 'feedback' table
        .select('*')
        .order('created_at', { ascending: false });

      if (feedbackFilter === 'unread') {
        query = query.eq('is_read', false);
      } else if (feedbackFilter === 'read') {
        query = query.eq('is_read', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setFeedbackItems(data || []);
    } catch (error: any) {
      toast({
        title: 'Error Fetching Feedback',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFeedbackLoading(false);
    }
  }, [feedbackFilter, toast]);

  // This hook calls `fetchFeedback` when the "Feedback" tab is active
  useEffect(() => {
    if (activeTab === 'feedback') {
      fetchFeedback();
    }
  }, [activeTab, fetchFeedback]);

  // Function to mark a message as read/unread
  const handleToggleRead = async (id: number, currentStatus: boolean) => {
    setUpdatingFeedbackId(id);
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ is_read: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      toast({
        title: 'Success',
        description: `Message marked as ${!currentStatus ? 'read' : 'unread'}.`,
      });
      fetchFeedback(); // Refresh the list after updating
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdatingFeedbackId(null);
    }
  };

  // Function to delete a message
  const handleDeleteFeedback = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message forever?')) {
      return;
    }
    setUpdatingFeedbackId(id);
    try {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;
      toast({
        title: 'Message Deleted',
        description: 'The message has been permanently removed.',
      });
      fetchFeedback(); // Refresh the list after deleting
    } catch (error: any) {
      toast({
        title: 'Error deleting message',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdatingFeedbackId(null);
    }
  };

  // --- END OF FEEDBACK TAB LOGIC ---


  // --- Product Creation/Editing Logic (Original Functions) ---

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
        .limit(1);
      if (error) { console.error('Error checking product number:', error); break; }
      if (!data || data.length === 0) { isUnique = true; }
    }
    setProductData(prev => ({ ...prev, product_number: productNumber }));
    toast({
      title: "Product Number Generated",
      description: `Generated unique product number: ${productNumber}`,
    });
  };

  const generateVariationCombinations = useCallback(() => {
    const combinations: Array<{wood: string, cushion: string, key: string}> = [];
    woodOptions.forEach(wood => {
      cushionOptions.forEach(cushion => {
        combinations.push({ wood, cushion, key: `${wood}_${cushion}` });
      });
    });
    return combinations;
  }, [woodOptions, cushionOptions]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMainImagePreview(result);
        setProductData(prev => ({...prev, image_url: result}));
        if (selectedWood && selectedCushion) {
          const mainKey = `${selectedWood}_${selectedCushion}`;
          setVariationData(prev => ({
            ...prev,
            [mainKey]: { file, preview: result, price: productData.price || prev[mainKey]?.price || '' }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!selectedWood || !selectedCushion || !mainImageFile || !mainImagePreview) return;
    const mainKey = `${selectedWood}_${selectedCushion}`;
    setVariationData(prev => ({
      ...prev,
      [mainKey]: { file: mainImageFile, preview: mainImagePreview, price: productData.price || prev[mainKey]?.price || '' }
    }));
  }, [selectedWood, selectedCushion, mainImageFile, mainImagePreview, productData.price]);

  const handleViewImageChange = (viewNumber: 'view1' | 'view2' | 'view3' | 'view4', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setViewImages(prev => ({ ...prev, [viewNumber]: { file, preview: result } }));
        setProductData(prev => ({ ...prev, [`${viewNumber}_image_url`]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariationImageChange = (variationKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setVariationData(prev => ({
          ...prev,
          [variationKey]: { ...prev[variationKey], file, preview: result, price: prev[variationKey]?.price || '' }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteProductSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { name, product_number, theme, category, image_url, description } = productData;
      if (!name || !product_number || !theme || !category || !selectedWood || !selectedCushion) {
        throw new Error("Please fill in all required fields");
      }
      
      const mainKey = `${selectedWood}_${selectedCushion}`;
      const mainPrice = variationData[mainKey]?.price || productData.price;

      const mainProductData: any = {
        name, product_number, theme, category, image_url, description,
        wood_type: selectedWood,
        cushion_type: selectedCushion,
        price: parseFloat(mainPrice) || 0,
        is_main_variant: true,
        view1_image_url: productData.view1_image_url,
        view2_image_url: productData.view2_image_url,
        view3_image_url: productData.view3_image_url,
        view4_image_url: productData.view4_image_url,
        customized_image_url: mainImagePreview || image_url // Always save main image as customized_image_url for main variant
      };

      if (editingProduct?.id) mainProductData.id = editingProduct.id;

      const { error: mainError } = await supabase.from('products').upsert([mainProductData]).select().single();
      if (mainError) throw mainError;

      const combinations = generateVariationCombinations();
      const variations = combinations
        .filter(({ key }) => key !== mainKey)
        .map(({ wood, cushion, key }) => ({
          name, product_number, theme, category, description,
          image_url: '',
          customized_image_url: variationData[key]?.preview || '',
          wood_type: wood,
          cushion_type: cushion,
          price: parseFloat(variationData[key]?.price) || 0,
          is_main_variant: false,
        }));

      if (variations.length) {
        const { error: varError } = await supabase.from('products').upsert(variations);
        if (varError) throw varError;
      }

      toast({
        title: editingProduct ? "Product Updated" : "Product Created",
        description: "Product and its variations were saved successfully.",
      });
      
      setEditingProduct(null);
      setProductData({ name: '', price: '', product_number: '', theme: '', category: '', image_url: '', description: '', view1_image_url: '', view2_image_url: '', view3_image_url: '', view4_image_url: '' });
      setSelectedWood('');
      setSelectedCushion('');
      setMainImagePreview('');
      setViewImages({ view1: { file: null, preview: '' }, view2: { file: null, preview: '' }, view3: { file: null, preview: '' }, view4: { file: null, preview: '' } });
      setVariationData({});
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [productData, selectedWood, selectedCushion, variationData, generateVariationCombinations, toast, refetch, editingProduct]);

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
                <Button variant={activeTab === 'orders' ? 'default' : 'ghost'} onClick={() => setActiveTab('orders')} className="px-6"> <Package className="w-4 h-4 mr-2" /> Orders </Button>
                <Button variant={activeTab === 'projects' ? 'default' : 'ghost'} onClick={() => setActiveTab('projects')} className="px-6"> <Layers className="w-4 h-4 mr-2" /> Projects </Button>
                <Button variant={activeTab === 'feedback' ? 'default' : 'ghost'} onClick={() => setActiveTab('feedback')} className="px-6"> <MessageSquare className="w-4 h-4 mr-2" /> Feedback </Button>
                <Button variant={activeTab === 'post' ? 'default' : 'ghost'} onClick={() => setActiveTab('post')} className="px-6"> <Plus className="w-4 h-4 mr-2" /> Create </Button>
                <Button variant={activeTab === 'edit' ? 'default' : 'ghost'} onClick={() => setActiveTab('edit')} className="px-6"> <Settings className="w-4 h-4 mr-2" /> Edit </Button>
              </nav>
            </div>
            <Button onClick={signOut} variant="outline" className="px-6"> Sign Out </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'orders' && <OrdersTab />}
        
        {activeTab === 'projects' && <ProjectsTab />}

        {activeTab === 'feedback' && <FeedbackTab />}
        
        {activeTab === 'edit' && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center"><Settings className="w-5 h-5 text-primary" /></div>
                <div>
                  <CardTitle className="text-2xl">Edit Products</CardTitle>
                  <p className="text-muted-foreground mt-1">Modify existing product details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Existing Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square bg-muted">
                        {product.image ? (<img src={product.image} alt={product.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center bg-muted"><span className="text-muted-foreground">No image</span></div>)}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.product_number}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline">{product.category}</Badge>
                          <Button variant="outline" size="sm" onClick={async () => {
                              try {
                                const { data, error } = await supabase.from('products').select('*').eq('id', product.id).single();
                                if (error) throw error;
                                if (data) {
                                  setEditingProduct({ ...data, price: data.price?.toString() || '' });
                                  setProductData({
                                    name: data.name || '', price: data.price?.toString() || '', product_number: data.product_number || '',
                                    theme: data.theme || '', category: data.category || '', image_url: data.image_url || '',
                                    description: data.description || '', view1_image_url: data.view1_image_url || '',
                                    view2_image_url: data.view2_image_url || '', view3_image_url: data.view3_image_url || '',
                                    view4_image_url: data.view4_image_url || '',
                                  });
                                  setSelectedWood(data.wood_type || '');
                                  setSelectedCushion(data.cushion_type || '');
                                  if (data.image_url) setMainImagePreview(data.image_url);
                                  // Pre-fill variationData for main variant so its image/price always show
                                  const mainKey = `${data.wood_type || ''}_${data.cushion_type || ''}`;
                                  setVariationData(prev => ({
                                    ...prev,
                                    [mainKey]: {
                                      file: null,
                                      preview: data.customized_image_url || data.image_url || '',
                                      price: data.price?.toString() || ''
                                    }
                                  }));
                                  setActiveTab('post');
                                }
                              } catch (error) {
                                console.error("Error loading product for edit:", error);
                                toast({ title: "Error", description: "Failed to load product details for editing.", variant: "destructive" });
                              }
                            }}>Edit</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'post' && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center"><Grid className="w-5 h-5 text-primary" /></div>
                <div>
                  <CardTitle className="text-2xl">{editingProduct ? "Edit Product" : "Create Complete Product"}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {editingProduct ? `Editing ${editingProduct.name} (${editingProduct.product_number})` : "Create product with all variations in one go"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleCompleteProductSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Main Product Image</Label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                        <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" id="main-image-upload" required={!editingProduct}/>
                        <Label htmlFor="main-image-upload" className="cursor-pointer">
                          <div className="space-y-3">
                            {mainImagePreview ? (<img src={mainImagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg mx-auto shadow-lg"/>) : (<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"><Upload className="w-8 h-8 text-primary" /></div>)}
                            <p className="text-sm text-muted-foreground">{mainImagePreview ? 'Click to change image' : 'Upload main product image'}</p>
                          </div>
                        </Label>
                      </div>
                      <div className="space-y-3 border border-border/50 rounded-lg p-4 bg-background/50">
                        <h4 className="text-sm font-medium text-center">Select Wood & Cushion Type for Main Image</h4>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground text-center">Wood Type</p>
                          <div className="flex justify-center gap-2 flex-wrap">
                            {woodOptions.map(wood => (<button key={wood} type="button" className={`border p-1 rounded-md transition-all ${selectedWood === wood ? 'border-primary ring-1 ring-primary/30 shadow-sm' : 'border-border/50 hover:border-primary/50'}`} onClick={() => setSelectedWood(wood)} title={wood.charAt(0).toUpperCase() + wood.slice(1)}><img src={`/assets/wood/${wood}.png`} alt={wood} className="w-8 h-8 object-cover rounded" /></button>))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground text-center">Cushion Type</p>
                          <div className="flex justify-center gap-2 flex-wrap">
                            {cushionOptions.map(cushion => (<button key={cushion} type="button" className={`border p-1 rounded-md transition-all ${selectedCushion === cushion ? 'border-primary ring-1 ring-primary/30 shadow-sm' : 'border-border/50 hover:border-primary/50'}`} onClick={() => setSelectedCushion(cushion)} title={cushion.charAt(0).toUpperCase() + cushion.slice(1)}><img src={`/assets/cushion/${cushion}.png`} alt={cushion} className="w-8 h-8 object-cover rounded" /></button>))}
                          </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          Selected: {selectedWood && selectedCushion ? <span className="font-medium text-foreground">{selectedWood.charAt(0).toUpperCase() + selectedWood.slice(1)} wood with {selectedCushion.charAt(0).toUpperCase() + selectedCushion.slice(1)} cushion</span> : "Please select both wood and cushion type"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="name">Product Name</Label><Input id="name" type="text" placeholder="Elegant Modern Chair" value={productData.name} onChange={(e) => setProductData({...productData, name: e.target.value})} className="h-12" required/></div>
                    <div className="space-y-2"><Label htmlFor="product-number">Product Code</Label><div className="flex gap-2"><Input id="product-number" type="text" placeholder="FRN-001" value={productData.product_number} onChange={(e) => setProductData({...productData, product_number: e.target.value})} className="h-12 flex-1" required/><Button type="button" onClick={generateProductNumber} variant="outline" className="h-12 px-4"><RefreshCw className="w-4 h-4" /></Button></div></div>
                    <div className="space-y-2"><Label htmlFor="theme">Theme</Label><Select value={productData.theme} onValueChange={(value) => setProductData({...productData, theme: value})} required><SelectTrigger className="h-12"><SelectValue placeholder="Select theme" /></SelectTrigger><SelectContent>{Object.entries(themes).map(([key, value]) => (<SelectItem key={key} value={key}>{value}</SelectItem>))}</SelectContent></Select></div>
                    <div className="space-y-2"><Label htmlFor="category">Category</Label><Select value={productData.category} onValueChange={(value) => setProductData({...productData, category: value})} required><SelectTrigger className="h-12"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{Object.entries(categories).map(([key, value]) => (<SelectItem key={key} value={key}>{value}</SelectItem>))}</SelectContent></Select></div>
                    <div className="space-y-2"><Label htmlFor="price">Base Price (₹)</Label><Input id="price" type="number" step="0.01" placeholder="25,000.00" value={productData.price} onChange={(e) => setProductData({...productData, price: e.target.value})} className="h-12" required/></div>
                    <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" rows={3} placeholder="Product description..." value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })}/></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product View Images (Optional)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['view1', 'view2', 'view3', 'view4'].map((view, index) => (<div key={view} className="space-y-2"><div className="aspect-square border-2 border-dashed border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"><input type="file" accept="image/*" onChange={(e) => handleViewImageChange(view as any, e)} className="hidden" id={`${view}-upload`}/><Label htmlFor={`${view}-upload`} className="cursor-pointer h-full flex items-center justify-center">{viewImages[view as keyof typeof viewImages].preview ? (<img src={viewImages[view as keyof typeof viewImages].preview} alt={`View ${index + 1}`} className="w-full h-full object-cover"/>) : (<div className="text-center p-4"><Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" /><p className="text-xs text-muted-foreground">View {index + 1}</p></div>)}</Label></div></div>))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Customization Variation Images (Optional)</h3>
                    <p className="text-muted-foreground mt-2">Upload images for each wood and cushion combination.</p>
                    <Badge variant="outline" className="mt-2">Variations without images will show placeholder</Badge>
                  </div>
                  <div className="space-y-8">
                    {woodOptions.map((wood) => (<div key={wood} className="space-y-4"><h4 className="text-lg font-semibold capitalize border-b pb-2">{wood} Wood Variations</h4><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">{cushionOptions.map((cushion) => { const variationKey = `${wood}_${cushion}`; return (<div key={variationKey} className="space-y-2"><div className="aspect-square border-2 border-dashed border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"><input type="file" accept="image/*" onChange={(e) => handleVariationImageChange(variationKey, e)} className="hidden" id={`variation-${variationKey}`}/><Label htmlFor={`variation-${variationKey}`} className="cursor-pointer h-full flex items-center justify-center">{variationData[variationKey]?.preview ? (<img src={variationData[variationKey].preview} alt={`${wood} with ${cushion}`} className="w-full h-full object-cover"/>) : (<div className="text-center p-2"><Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" /></div>)}</Label></div><Input type="number" placeholder="Price" value={variationData[variationKey]?.price || ''} onChange={e => setVariationData(prev => ({...prev, [variationKey]: { ...prev[variationKey], price: e.target.value, file: prev[variationKey]?.file || null, preview: prev[variationKey]?.preview || '' }}))} className="w-full mt-1"/><p className="text-xs text-center text-muted-foreground capitalize">{wood} + {cushion}</p></div>); })}</div></div>))}
                  </div>
                </div>

                {editingProduct && (<Button type="button" variant="outline" className="w-full h-12 text-base" onClick={() => {
                      setEditingProduct(null);
                      setProductData({ name: '', price: '', product_number: '', theme: '', category: '', image_url: '', description: '', view1_image_url: '', view2_image_url: '', view3_image_url: '', view4_image_url: '' });
                      setSelectedWood(''); setSelectedCushion(''); setMainImagePreview('');
                      setViewImages({ view1: { file: null, preview: '' }, view2: { file: null, preview: '' }, view3: { file: null, preview: '' }, view4: { file: null, preview: '' } });
                      setVariationData({});
                      setActiveTab('edit');
                    }}>Cancel Editing</Button>
                )}

                <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : editingProduct ? <Settings className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                  {loading ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product & Variations' : 'Create Product & Variations')}
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