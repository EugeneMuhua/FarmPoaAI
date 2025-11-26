import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, MapPin, Package, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity_available: number;
  unit: string;
  category: string;
  location: string | null;
  image_url: string | null;
}

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, quantity_available, unit, category, location, image_url')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background px-4 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Buyer Dashboard</h1>
          <p className="text-muted-foreground text-sm">Discover fresh farm products</p>
        </div>

        <div className="px-4 space-y-6 mt-6">
          {/* Large Search Bar */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Find Fresh Produce</h2>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for products, categories, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Produce Listings */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Featured Produce Listings</h2>
                <p className="text-sm text-muted-foreground">Fresh from local farmers</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/marketplace")}
              >
                View All
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-24 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/marketplace")}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package className="w-8 h-8 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              {product.category}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-primary mb-1">
                            KSh {product.price}/{product.unit}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {product.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {product.location}
                              </span>
                            )}
                            <span>{product.quantity_available} {product.unit} available</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">No Products Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Check back soon for new listings from local farmers
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Find Local Agrovets */}
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/expert-connections")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-foreground">Find Local Agrovets</CardTitle>
                  <CardDescription>Connect with agricultural specialists near you</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                <Search className="w-4 h-4 mr-2" />
                Browse Agrovets & Specialists
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/profile")}>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage account</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center mb-2">
                  <ShoppingBag className="w-5 h-5 text-warning" />
                </div>
                <CardTitle className="text-base">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
