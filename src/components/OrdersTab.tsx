import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const OrdersTab = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Customer Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ordersLoading ? (
          <div className="text-center py-4">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No orders yet
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{order.product_name}</h3>
                      <p className="text-sm text-muted-foreground">Code: {order.product_code}</p>
                    </div>
                    <Badge variant="outline">
                      {order.order_status}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Customer:</strong> {order.customer_name}
                    </div>
                    <div>
                      <strong>Email:</strong> {order.customer_email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {order.customer_phone}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Wood:</strong> {order.wood_type}
                    </div>
                    <div>
                      <strong>Cushioning:</strong> {order.cushioning_type}
                    </div>
                  </div>
                  {order.customization_message && (
                    <div className="mt-2">
                      <strong>Customization:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.customization_message}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};