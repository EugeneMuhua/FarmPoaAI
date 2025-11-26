import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, Calendar, MapPin, DollarSign, Phone, User } from 'lucide-react';

interface Order {
  id: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  delivery_address: string | null;
  notes: string | null;
  products: {
    name: string;
    unit: string;
    price: number;
  };
  profiles: {
    full_name: string;
    phone: string;
  };
}

export const FarmerOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products!orders_product_id_fkey (
          name,
          unit,
          price
        ),
        profiles!orders_buyer_id_fkey (
          full_name,
          phone
        )
      `)
      .eq('products.farmer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Order marked as ${newStatus}`,
      });
      fetchOrders();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          Loading orders...
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>No orders yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            When buyers place orders for your products, they will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-1">Your Orders</h3>
        <p className="text-sm text-muted-foreground">
          Manage orders from buyers
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {order.products?.name || 'Unknown Product'}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Order #{order.id.slice(0, 8)}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Buyer Info */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-semibold text-sm text-foreground mb-2">Buyer Information</h4>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{order.profiles?.full_name || 'Unknown'}</span>
                </div>
                {order.profiles?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{order.profiles.phone}</span>
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Quantity: <span className="font-medium text-foreground">{order.quantity} {order.products?.unit || ''}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Total: <span className="font-medium text-foreground">KSH {order.total_price}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Ordered: <span className="font-medium text-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </span>
              </div>

              {order.delivery_address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    Delivery: <span className="font-medium text-foreground">{order.delivery_address}</span>
                  </span>
                </div>
              )}

              {order.notes && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Notes:</span> {order.notes}
                  </p>
                </div>
              )}

              {/* Status Actions */}
              {order.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    className="flex-1"
                  >
                    Confirm Order
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              
              {order.status === 'confirmed' && (
                <Button
                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                  className="w-full"
                >
                  Mark as Delivered
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
