import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getThemeNames, getCategoryNames } from '@/data/furnitureData';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('order');
  const [loading, setLoading] = useState(false);

  // Combined form state for both furniture card and product details
  const [formData, setFormData] = useState({
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
    wood_type: '',
    cushion_type: '',
    customized_image_url: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({...formData, image_url: result});
      };
      reader.readAsDataURL(file);
    }
  };

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
        setFormData(prev => ({
          ...prev,
          [`${viewNumber}_image_url`]: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomImagePreview(result);
        setFormData({...formData, customized_image_url: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          price: parseFloat(formData.price),
          product_number: formData.product_number,
          theme: formData.theme,
          category: formData.category,
          image_url: formData.image_url,
          description: formData.description,
          view1_image_url: formData.view1_image_url,
          view2_image_url: formData.view2_image_url,
          view3_image_url: formData.view3_image_url,
          view4_image_url: formData.view4_image_url,
          wood_type: formData.wood_type,
          cushion_type: formData.cushion_type,
          customized_image_url: formData.customized_image_url
        }]);

      if (error) throw error;

      toast({
        title: "Product Added",
        description: "Both furniture card and product page have been created successfully",
      });

      // Reset form
      setFormData({
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
        wood_type: '',
        cushion_type: '',
        customized_image_url: ''
      });
      setImageFile(null);
      setImagePreview('');
      setViewImages({
        view1: { file: null, preview: '' },
        view2: { file: null, preview: '' },
        view3: { file: null, preview: '' },
        view4: { file: null, preview: '' }
      });
      setCustomImageFile(null);
      setCustomImagePreview('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <div className="flex space-x-4">
                <Button
                  variant={activeTab === 'order' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('order')}
                >
                  Order
                </Button>
                <Button
                  variant={activeTab === 'feedback' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('feedback')}
                >
                  Feedback
                </Button>
                <Button
                  variant={activeTab === 'post' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('post')}
                >
                  Post
                </Button>
              </div>
            </div>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'order' && (
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Order management coming soon...</p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'feedback' && (
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Feedback management coming soon...</p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'post' && (
          <div className="space-y-8">
            {/* Section 1: Furniture Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary">Section 1: Furniture Card</CardTitle>
                <p className="text-muted-foreground">Creates cards displayed in themes and categories</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Main Product Image */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Image *</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-32 w-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <Input
                        type="text"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Code Number *</label>
                      <Input
                        type="text"
                        placeholder="e.g., FRN-001"
                        value={formData.product_number}
                        onChange={(e) => setFormData({...formData, product_number: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme *</label>
                      <Select
                        value={formData.theme}
                        onValueChange={(value) => setFormData({...formData, theme: value})}
                        required
                      >
                        <SelectTrigger>
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({...formData, category: value})}
                        required
                      >
                        <SelectTrigger>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₱) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="button" onClick={() => toast({title: "Card Created", description: "Furniture card added successfully"})} className="w-full">
                    Add Card
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Product Page */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary">Section 2: Product Page</CardTitle>
                <p className="text-muted-foreground">Creates detailed product page with customization options</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <Input
                        type="text"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Code Number *</label>
                      <Input
                        type="text"
                        placeholder="e.g., FRN-001"
                        value={formData.product_number}
                        onChange={(e) => setFormData({...formData, product_number: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Product Views - 4 Image Grid */}
                  <div>
                    <label className="block text-sm font-medium mb-4">View 1, 2, 3, 4 (Images uploaded from system)</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['view1', 'view2', 'view3', 'view4'].map((view, index) => (
                        <div key={view}>
                          <label className="block text-xs text-muted-foreground mb-2">View {index + 1}</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleViewImageChange(view as 'view1' | 'view2' | 'view3' | 'view4', e)}
                          />
                          {viewImages[view as keyof typeof viewImages].preview && (
                            <div className="mt-2">
                              <img 
                                src={viewImages[view as keyof typeof viewImages].preview} 
                                alt={`View ${index + 1} Preview`} 
                                className="h-24 w-24 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description Field</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter detailed product description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Customized Furniture Image */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Customized Furniture (Upload from System)</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomImageChange}
                    />
                    {customImagePreview && (
                      <div className="mt-4">
                        <img 
                          src={customImagePreview} 
                          alt="Customized Preview" 
                          className="h-32 w-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Customization Options */}
                  <div>
                    <label className="block text-sm font-medium mb-4">Options for Wood and Cushioning</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-3">Options for Wood</h5>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Solid Wood:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {['teak', 'walnut', 'pine', 'mango'].map((wood) => (
                                <label key={wood} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name="wood_type"
                                    value={wood}
                                    checked={formData.wood_type === wood}
                                    onChange={(e) => setFormData({...formData, wood_type: e.target.value})}
                                    className="text-primary focus:ring-primary"
                                  />
                                  <span className="text-sm capitalize">{wood}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Plywood:</p>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.wood_type === 'plywood'}
                                onChange={(e) => setFormData({...formData, wood_type: e.target.checked ? 'plywood' : ''})}
                                className="text-primary focus:ring-primary rounded"
                              />
                              <span className="text-sm">Plywood</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-3">Options for Cushioning</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {['polyester', 'foam', 'down', 'cotton', 'shell'].map((cushion) => (
                            <label key={cushion} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="cushion_type"
                                value={cushion}
                                checked={formData.cushion_type === cushion}
                                onChange={(e) => setFormData({...formData, cushion_type: e.target.value})}
                                className="text-primary focus:ring-primary"
                              />
                              <span className="text-sm capitalize">{cushion}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Adding Product...' : 'Add Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;