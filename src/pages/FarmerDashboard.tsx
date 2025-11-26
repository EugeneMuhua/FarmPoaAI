import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scan, Plus, Sprout, Droplets, CloudRain, TrendingUp, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity_available: number;
  unit: string;
  category: string;
  is_available: boolean;
}

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, quantity_available, unit, category, is_available')
        .eq('farmer_id', user?.id)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const soilHealthTips = [
    {
      icon: Droplets,
      title: "Soil Moisture Management",
      description: "Current season requires balanced irrigation. Monitor moisture levels daily.",
      priority: "high"
    },
    {
      icon: Sprout,
      title: "Crop Rotation Reminder",
      description: "Consider rotating legumes to naturally enrich soil nitrogen levels.",
      priority: "medium"
    },
    {
      icon: CloudRain,
      title: "Weather Alert",
      description: "Rain expected this week. Adjust irrigation schedule accordingly.",
      priority: "high"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background px-4 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, Farmer!</h1>
          <p className="text-muted-foreground text-sm">Manage your farm efficiently</p>
        </div>

        {/* Main Scan Button - Prominent Hero Section */}
        <div className="px-4 -mt-4 mb-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Scan className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1">AI-Powered Scanner</h2>
                  <p className="text-white/90 text-sm">Scan produce, soil, or animals for instant analysis</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/scan")} 
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-6 text-lg"
                size="lg"
              >
                <Scan className="w-5 h-5 mr-2" />
                Start Scanning Now
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 space-y-6">
          {/* My Active Listings */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">My Active Listings</h2>
                <p className="text-sm text-muted-foreground">Products currently available</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/marketplace")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </Button>
            </div>

            {loading ? (
              <div className="grid gap-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-16 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid gap-3">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-primary">
                              KSh {product.price}/{product.unit}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {product.quantity_available} {product.unit} available
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">No Active Listings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start listing your products to reach more buyers
                  </p>
                  <Button onClick={() => navigate("/marketplace")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Listing
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* AI-Generated Soil Health Tips */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                AI Farm Insights
              </h2>
              <p className="text-sm text-muted-foreground">Personalized tips for your farm</p>
            </div>

            <div className="grid gap-3">
              {soilHealthTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tip.priority === 'high' 
                            ? 'bg-destructive/10' 
                            : 'bg-primary/10'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            tip.priority === 'high' 
                              ? 'text-destructive' 
                              : 'text-primary'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-foreground">{tip.title}</h3>
                            {tip.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">Priority</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-4 bg-muted/50 border-dashed">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  More personalized insights coming soon based on your farm data
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
