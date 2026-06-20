"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Loader2, Search, Package, Calendar, MapPin, CheckCircle2, Circle, Truck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_STEPS = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
const STATUS_LABELS: Record<string, string> = {
  confirmed: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/track-order");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = await user?.getIdToken(true);
      if (!token) throw new Error("No auth token");

      const res = await fetch("/api/track-order", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/login?redirect=/track-order");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Could not load orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const lowerQuery = searchQuery.toLowerCase();
    return orders.filter(order => {
      if (order.id.toLowerCase().includes(lowerQuery)) return true;
      if (new Date(order.createdAt).toLocaleDateString().includes(lowerQuery)) return true;
      if (order.items?.some((item: any) => item.name.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }, [orders, searchQuery]);

  if (loading || !user) {
    return <div className="min-h-[calc(100vh-200px)] flex items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] max-w-4xl">
      <h1 className="text-3xl font-bold tracking-widest text-primary font-serif mb-2">MY ORDERS</h1>
      <p className="text-muted-foreground mb-8">Track and view your past purchases.</p>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search by Order ID, product, or date..." 
          className="pl-10 h-12 text-lg bg-card"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loadingOrders ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border/50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "No orders match your search criteria." : "You haven't placed any orders yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <Card key={order.id} className="overflow-hidden border-border/50">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Order #{order.id}
                      {order.status === 'cancelled' && <Badge variant="destructive">Cancelled</Badge>}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" /> 
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">₹{order.total?.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-end gap-1 mt-1">
                      <MapPin className="h-4 w-4" /> {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Visual Stepper */}
                {order.status !== 'cancelled' && (
                  <div className="px-6 py-8 border-b border-border/50 bg-card/50 overflow-x-auto">
                    <div className="min-w-[500px]">
                      <div className="relative flex items-center justify-between">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10"></div>
                        
                        {STATUS_STEPS.map((step, index) => {
                          const currentStepIndex = STATUS_STEPS.indexOf(order.status || 'confirmed');
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10 bg-card/50 px-2">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} mb-2 border-4 border-card`}>
                                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                              </div>
                              <span className={`text-xs font-semibold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                {STATUS_LABELS[step] || step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tracking Info if available */}
                {(order.trackingNumber || order.carrier) && (
                  <div className="px-6 py-4 bg-primary/5 border-b border-border/50 flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Tracking details available</p>
                      <p className="text-xs text-muted-foreground">
                        {order.carrier && <span className="font-medium mr-2">{order.carrier}</span>}
                        {order.trackingNumber && <span>Tracking #: {order.trackingNumber}</span>}
                      </p>
                    </div>
                    {order.trackingLink && (
                      <a href={order.trackingLink} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "sm", className: "ml-auto" })}>
                        Track Package
                      </a>
                    )}
                  </div>
                )}

                {/* Items */}
                <div className="p-6 divide-y divide-border/50">
                  <h4 className="font-semibold mb-4 text-sm tracking-widest text-muted-foreground uppercase">Items Ordered</h4>
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-muted" />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <span>Qty: {item.quantity}</span>
                          {item.flavor && <span>• {item.flavor}</span>}
                          {item.weight && <span>• {item.weight}</span>}
                        </div>
                      </div>
                      <div className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
