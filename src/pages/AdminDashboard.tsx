import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getThemeNames, getCategoryNames } from '@/data/furnitureData';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('post');
  const [loading, setLoading] = useState(false);

  // Form state
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
        description: "Product has been successfully added to the database",
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
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Image</label>
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input
                      type="text"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
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
                    <label className="block text-sm font-medium mb-2">Category</label>
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Number</label>
                    <Input
                      type="text"
                      placeholder="e.g., FRN-001"
                      value={formData.product_number}
                      onChange={(e) => setFormData({...formData, product_number: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₱)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Adding Product...' : 'Add Product'}
                </Button>
              </form>

              {/* Customization Section */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-6">Customization Details</h3>
                <div className="space-y-6">
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Product description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* View Images Grid */}
                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Product Views (Image URLs)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">View 1</label>
                        <Input
                          type="url"
                          placeholder="View 1 Image URL"
                          value={formData.view1_image_url}
                          onChange={(e) => setFormData({ ...formData, view1_image_url: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">View 2</label>
                        <Input
                          type="url"
                          placeholder="View 2 Image URL"
                          value={formData.view2_image_url}
                          onChange={(e) => setFormData({ ...formData, view2_image_url: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">View 3</label>
                        <Input
                          type="url"
                          placeholder="View 3 Image URL"
                          value={formData.view3_image_url}
                          onChange={(e) => setFormData({ ...formData, view3_image_url: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">View 4</label>
                        <Input
                          type="url"
                          placeholder="View 4 Image URL"
                          value={formData.view4_image_url}
                          onChange={(e) => setFormData({ ...formData, view4_image_url: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wood and Cushion Types */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Wood Type
                      </label>
                      <Select
                        value={formData.wood_type}
                        onValueChange={(value) => setFormData({ ...formData, wood_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Wood Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Oak">Oak</SelectItem>
                          <SelectItem value="Walnut">Walnut</SelectItem>
                          <SelectItem value="Pine">Pine</SelectItem>
                          <SelectItem value="Maple">Maple</SelectItem>
                          <SelectItem value="Mahogany">Mahogany</SelectItem>
                          <SelectItem value="Teak">Teak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Cushion Type
                      </label>
                      <Select
                        value={formData.cushion_type}
                        onValueChange={(value) => setFormData({ ...formData, cushion_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Cushion Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Polyester">Polyester</SelectItem>
                          <SelectItem value="Foam">Foam</SelectItem>
                          <SelectItem value="Down">Down</SelectItem>
                          <SelectItem value="Cotton">Cotton</SelectItem>
                          <SelectItem value="Wool">Wool</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Customized Image */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Customized Furniture Image URL
                    </label>
                    <Input
                      type="url"
                      placeholder="Customized furniture image URL"
                      value={formData.customized_image_url}
                      onChange={(e) => setFormData({ ...formData, customized_image_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;