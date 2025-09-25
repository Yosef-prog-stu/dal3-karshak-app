import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useCurrency } from "@/hooks/use-currency";
import { ShoppingCart, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createOrder, listOrders } from "@/integrations/supabase/orders";
import { useToast } from "@/hooks/use-toast";

export const CartSheet: React.FC = () => {
  const { state, setItemQty, removeItem, clear, totalQuantity } = useCart();
  const { formatFromSarToEgp } = useCurrency();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("cart:open", handler as EventListener);
    return () => window.removeEventListener("cart:open", handler as EventListener);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("app.checkout.info");
      if (raw) {
        const obj = JSON.parse(raw) as { name?: string; phone?: string; address?: string };
        setCustomerName(obj.name || "");
        setCustomerPhone(obj.phone || "");
        setCustomerAddress(obj.address || "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "app.checkout.info",
        JSON.stringify({ name: customerName, phone: customerPhone, address: customerAddress })
      );
    } catch {}
  }, [customerName, customerPhone, customerAddress]);

  // التحقق من الطلبات الجاهزة
  useEffect(() => {
    const checkReadyOrders = async () => {
      if (customerPhone) {
        const orders = await listOrders();
        if (orders) {
          const userOrders = orders.filter(order => 
            order.customer_phone === customerPhone && order.status === 'ready'
          );
          if (userOrders.length > 0) {
            toast({
              title: "🎉 لقد تم تجهيز طلبك!",
              description: "طلبك جاهز للاستلام. شكراً لاختيارك مطعم دلع كرشك!",
              duration: 10000,
            });
          }
        }
      }
    };

    // تحقق كل 30 ثانية
    const interval = setInterval(checkReadyOrders, 30000);
    checkReadyOrders(); // تحقق فوري

    return () => clearInterval(interval);
  }, [customerPhone, toast]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="w-4 h-4" />
          <span className="ml-2">السلة</span>
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {totalQuantity}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[360px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle>سلة الطلبات</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {state.items.length === 0 ? (
            <div className="text-sm text-muted-foreground">لا توجد عناصر في السلة.</div>
          ) : (
            state.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                {it.imageUrl ? (
                  <img src={it.imageUrl} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xl">{it.emoji || "🍽️"}</div>
                )}
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{formatFromSarToEgp(it.priceSar)} لكل وحدة</div>
                  {it.note && <div className="text-xs mt-1">ملاحظة: {it.note}</div>}
                </div>
                <Input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => setItemQty(it.id, Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="w-16"
                />
                <Button variant="ghost" size="icon" onClick={() => removeItem(it.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        {state.items.length > 0 && (
          <>
            <div className="mt-6 space-y-3">
              <div>
                <label className="text-sm block mb-1">الاسم</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="اسمك الكامل" />
              </div>
              <div>
                <label className="text-sm block mb-1">رقم الهاتف (واتساب أو تيليجرام)</label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="مثال: 010xxxxxxxx" />
              </div>
              <div>
                <label className="text-sm block mb-1">العنوان</label>
                <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="الشارع - الحي - المدينة" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Button variant="destructive" onClick={clear}>تفريغ السلة</Button>
              <Button
                onClick={async () => {
                  const orderId = await createOrder({
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    customer_address: customerAddress,
                    items: state.items.map((it) => ({ id: it.id, name: it.name, qty: it.quantity, price_sar: it.priceSar, note: it.note, image_url: it.imageUrl, emoji: it.emoji })),
                    total_sar: state.items.reduce((a, c) => a + c.quantity * c.priceSar, 0),
                  });
                  if (orderId) {
                    toast({ title: "تم العملية الطلب بنجاح" });
                    clear();
                    setOpen(false);
                    window.dispatchEvent(new Event("admin:orders:refresh"));
                  } else {
                    toast({ title: "تعذر إتمام الطلب", description: "حاول مرة أخرى" });
                  }
                }}
              >
                الشراء
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export const CartSummary: React.FC = () => {
  const { totalPriceSar } = useCart();
  const { formatFromSarToEgp } = useCurrency();
  return <div className="text-sm text-muted-foreground">المجموع: {formatFromSarToEgp(totalPriceSar)}</div>;
};


