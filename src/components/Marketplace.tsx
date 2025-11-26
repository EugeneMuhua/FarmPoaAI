import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, ShoppingCart, MapPin, Calendar, Package } from 'lucide-react';
import { FarmerOrders } from './FarmerOrders';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image_url: string;
  quantity_available: number;
  location: string;
  harvest_date: string;
  farmer_id: string;
  profiles: {
    full_name: string;
    phone: string;
  };
}

interface Profile {
  user_type: string;
}

const Marketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    category: '',
    quantity_available: '',
    location: '',
    harvest_date: '',
  });

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Legumes',
    'Herbs',
    'Dairy',
    'Poultry',
    'Other'
  ];

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('user_id', user.id)
      .maybeSingle(); // Use maybeSingle to avoid errors when no profile exists

    if (error) {
      console.error('Error fetching profile:', error);
      // Set a default profile for demo purposes if no profile exists
      setUserProfile({ user_type: 'consumer' });
    } else if (data) {
      setUserProfile(data);
    } else {
      // No profile found, set default
      setUserProfile({ user_type: 'consumer' });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    
    // Try to fetch real products first
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_farmer_id_fkey (
          full_name,
          phone
        )
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      // Fall back to demo products if there's an error or no real products
      setProducts(getDemoProducts());
    } else if (data && data.length > 0) {
      setProducts(data);
    } else {
      // Show demo products if no real products exist
      setProducts(getDemoProducts());
    }
    setLoading(false);
  };

  const getDemoProducts = (): Product[] => [
    {
      id: 'demo-1',
      name: 'Fresh Tomatoes',
      description: 'Organic Roma tomatoes, vine-ripened and perfect for cooking',
      price: 120,
      unit: 'kg',
      category: 'Vegetables',
      image_url: '',
      quantity_available: 50,
      location: 'Nairobi, Kenya',
      harvest_date: '2025-01-10',
      farmer_id: 'demo-farmer-1',
      profiles: {
        full_name: 'John Mwangi',
        phone: '+254700000001'
      }
    },
    {
      id: 'demo-2',
      name: 'Green Kale',
      description: 'Fresh organic kale, rich in vitamins and perfect for healthy meals',
      price: 80,
      unit: 'bunch',
      category: 'Vegetables',
      image_url: '',
      quantity_available: 30,
      location: 'Nairobi, Kenya',
      harvest_date: '2025-01-12',
      farmer_id: 'demo-farmer-1',
      profiles: {
        full_name: 'John Mwangi',
        phone: '+254700000001'
      }
    },
    {
      id: 'demo-3',
      name: 'Sweet Bananas',
      description: 'Sweet and ripe bananas, perfect for snacking or baking',
      price: 60,
      unit: 'bunch',
      category: 'Fruits',
      image_url: '',
      quantity_available: 25,
      location: 'Kiambu, Kenya',
      harvest_date: '2025-01-08',
      farmer_id: 'demo-farmer-2',
      profiles: {
        full_name: 'Mary Wanjiku',
        phone: '+254700000002'
      }
    },
    {
      id: 'demo-4',
      name: 'Premium Avocados',
      description: 'Premium Hass avocados, creamy and delicious',
      price: 15,
      unit: 'piece',
      category: 'Fruits',
      image_url: '',
      quantity_available: 100,
      location: 'Kiambu, Kenya',
      harvest_date: '2025-01-11',
      farmer_id: 'demo-farmer-2',
      profiles: {
        full_name: 'Mary Wanjiku',
        phone: '+254700000002'
      }
    },
    {
      id: 'demo-5',
      name: 'White Maize',
      description: 'High-quality white maize, perfect for ugali and other dishes',
      price: 45,
      unit: 'kg',
      category: 'Grains',
      image_url: '',
      quantity_available: 200,
      location: 'Nakuru, Kenya',
      harvest_date: '2024-12-15',
      farmer_id: 'demo-farmer-3',
      profiles: {
        full_name: 'Peter Kimani',
        phone: '+254700000003'
      }
    },
    {
      id: 'demo-6',
      name: 'French Beans',
      description: 'Fresh, crispy French beans ideal for cooking',
      price: 150,
      unit: 'kg',
      category: 'Vegetables',
      image_url: '',
      quantity_available: 40,
      location: 'Nakuru, Kenya',
      harvest_date: '2025-01-09',
      farmer_id: 'demo-farmer-3',
      profiles: {
        full_name: 'Peter Kimani',
        phone: '+254700000003'
      }
    },
    {
      id: 'demo-7',
      name: 'Fresh Spinach',
      description: 'Organic spinach leaves, freshly harvested',
      price: 70,
      unit: 'bunch',
      category: 'Vegetables',
      image_url: '',
      quantity_available: 35,
      location: 'Nairobi, Kenya',
      harvest_date: '2025-01-13',
      farmer_id: 'demo-farmer-1',
      profiles: {
        full_name: 'John Mwangi',
        phone: '+254700000001'
      }
    },
    {
      id: 'demo-8',
      name: 'Orange Mangoes',
      description: 'Juicy Kent mangoes, sweet and tropical',
      price: 25,
      unit: 'piece',
      category: 'Fruits',
      image_url: '',
      quantity_available: 80,
      location: 'Kiambu, Kenya',
      harvest_date: '2025-01-05',
      farmer_id: 'demo-farmer-2',
      profiles: {
        full_name: 'Mary Wanjiku',
        phone: '+254700000002'
      }
    }
  ];

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || userProfile?.user_type !== 'farmer') {
      toast({
        title: "Error",
        description: "Only farmers can add products",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert([
        {
          farmer_id: user.id,
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          unit: newProduct.unit,
          category: newProduct.category,
          quantity_available: parseInt(newProduct.quantity_available),
          location: newProduct.location,
          harvest_date: newProduct.harvest_date,
        }
      ]);

    if (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      setAddProductOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        unit: 'kg',
        category: '',
        quantity_available: '',
        location: '',
        harvest_date: '',
      });
      fetchProducts();
    }
  };

  const handleOrder = async (product: Product) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to place an order",
        variant: "destructive",
      });
      return;
    }

    // For demo products, just show a success message
    if (product.id.startsWith('demo-')) {
      toast({
        title: "Demo Order Placed!",
        description: `Your demo order for ${product.name} has been placed. In the real app, the farmer would be notified.`,
      });
      return;
    }

    // For real products, create an actual order
    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            buyer_id: user.id,
            product_id: product.id,
            quantity: 1, // Default quantity, you could add a quantity selector
            total_price: product.price,
            status: 'pending',
            notes: `Order for ${product.name} from ${product.profiles?.full_name}`
          }
        ]);

      if (error) {
        console.error('Error creating order:', error);
        toast({
          title: "Order Failed",
          description: "There was an error placing your order. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Order Placed!",
          description: `Your order for ${product.name} has been placed. The farmer will contact you soon.`,
        });
      }
    } catch (err) {
      console.error('Order error:', err);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading marketplace...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background" id="marketplace">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">FarmPoa Marketplace</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect directly with local farmers and buy fresh, high-quality produce
          </p>
          {products.length > 0 && products[0].id.startsWith('demo-') && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                📋 <strong>Demo Mode:</strong> Showing sample products. Sign up as a farmer to add real products!
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {user && userProfile?.user_type === 'farmer' && (
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    List your fresh produce for sale
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (KSH)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Per kg</SelectItem>
                          <SelectItem value="piece">Per piece</SelectItem>
                          <SelectItem value="bunch">Per bunch</SelectItem>
                          <SelectItem value="bag">Per bag</SelectItem>
                          <SelectItem value="liter">Per liter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Available</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newProduct.quantity_available}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity_available: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="harvest-date">Harvest Date</Label>
                      <Input
                        id="harvest-date"
                        type="date"
                        value={newProduct.harvest_date}
                        onChange={(e) => setNewProduct({ ...newProduct, harvest_date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newProduct.location}
                      onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Add Product</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Farmer view with tabs for Products and Orders */}
        {user && userProfile?.user_type === 'farmer' ? (
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription>by {product.profiles?.full_name}</CardDescription>
                        </div>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {product.description && (
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-primary">
                          KSH {product.price}
                          <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{product.quantity_available} {product.unit} available</span>
                        </div>
                        
                        {product.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{product.location}</span>
                          </div>
                        )}
                        
                        {product.harvest_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Harvested: {new Date(product.harvest_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => handleOrder(product)} 
                        className="w-full"
                        disabled={!user}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {user ? 'Contact Farmer' : 'Login to Order'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              <FarmerOrders />
            </TabsContent>
          </Tabs>
        ) : (
          /* Buyer/Non-farmer view - just show products */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>by {product.profiles?.full_name}</CardDescription>
                      </div>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {product.description && (
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-primary">
                        KSH {product.price}
                        <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{product.quantity_available} {product.unit} available</span>
                      </div>
                      
                      {product.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{product.location}</span>
                        </div>
                      )}
                      
                      {product.harvest_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Harvested: {new Date(product.harvest_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => handleOrder(product)} 
                      className="w-full"
                      disabled={!user}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {user ? 'Contact Farmer' : 'Login to Order'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Marketplace;