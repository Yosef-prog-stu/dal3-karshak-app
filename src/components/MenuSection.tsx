import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import { tryParsePriceTextToNumber } from "@/lib/utils";
import { useMenuStore } from "@/hooks/use-menu-store";
import { useCart } from "@/hooks/use-cart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const MenuSection = () => {
  const { state } = useMenuStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(state.categories[0] || "جميع الأطباق");
  const categories = state.categories;
  const menuItems = useMemo(() => {
    if (!selectedCategory || selectedCategory === "جميع الأطباق") return state.items;
    return state.items.filter((i) => i.category === selectedCategory);
  }, [state.items, selectedCategory]);

  const { formatFromSarToEgp, isLoading, rateSarToEgp, lastUpdated } = useCurrency();
  const { addItem } = useCart();
  const [openForId, setOpenForId] = useState<number | null>(null);
  const [pendingQty, setPendingQty] = useState<number>(1);
  const [pendingNote, setPendingNote] = useState<string>("");

  function openAddDialog(id: number) {
    setOpenForId(id);
    setPendingQty(1);
    setPendingNote("");
  }

  function confirmAdd(item: typeof state.items[number]) {
    addItem({ id: item.id, name: item.name, priceSar: item.priceSar, imageUrl: item.imageUrl ?? undefined, emoji: (item as any).image, note: pendingNote || undefined }, Math.max(1, pendingQty));
    setOpenForId(null);
    // Open cart after adding
    window.dispatchEvent(new Event("cart:open"));
  }

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* العنوان */
        }
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            قائمة
            <span className="text-yellow-400 mr-3">الطعام</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف تشكيلة واسعة من الأطباق اللذيذة المحضرة بأجود المكونات
          </p>
          <div className="mt-3 text-sm text-muted-foreground">
            {isLoading && !rateSarToEgp ? (
              <span>جاري جلب سعر الصرف الحالي...</span>
            ) : (
              rateSarToEgp && (
                <span>
                  السعر التقريبي: 1 SAR = {formatFromSarToEgp(1)}
                  {" "}
                  <span className="opacity-70">
                    (آخر تحديث: {lastUpdated ? new Date(lastUpdated).toLocaleString("ar-EG") : new Date().toLocaleString("ar-EG")})
                  </span>
                </span>
              )
            )}
          </div>

          {/* قائمة تحويل الأسعار (عرض توضيحي) */}
          {!isLoading && rateSarToEgp && (
            <div className="mt-4 max-w-2xl mx-auto text-xs text-muted-foreground">
              <div className="grid grid-cols-3 gap-2 px-3 py-2 rounded-md border border-border bg-muted/30">
                <div className="font-semibold text-foreground">الطبق</div>
                <div className="font-semibold text-foreground text-center">السعر (SAR)</div>
                <div className="font-semibold text-foreground text-center">بعد التحويل (EGP)</div>
                {menuItems.map((m) => (
                  <React.Fragment key={m.id}>
                    <div className="truncate text-foreground/90" title={m.name}>{m.name}</div>
                    <div className="text-center">
                      {new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(m.priceSar)}
                    </div>
                    <div className="text-center">
                      {formatFromSarToEgp(m.priceSar)}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* فلتر الفئات */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={category === selectedCategory ? "golden" : "outline"}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* الأطباق */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-soft hover:shadow-warm transition-smooth group">
              <CardContent className="p-0">
                {/* صورة الطبق */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-6xl overflow-hidden">
                    {"imageUrl" in item && item.imageUrl ? (
                      <img src={(item as any).imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.image
                    )}
                  </div>
                  {item.isPopular && (
                    <Badge className="absolute top-4 right-4 gradient-hero text-primary-foreground">
                      الأكثر طلباً
                    </Badge>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 rtl:space-x-reverse">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                {/* معلومات الطبق */}
                <div className="p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {isLoading && !rateSarToEgp ? "..." : formatFromSarToEgp(item.priceSar)}
                    </div>
                    <Dialog open={openForId === item.id} onOpenChange={(o) => !o && setOpenForId(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="warm"
                          size="sm"
                          className="rounded-full"
                          onClick={() => openAddDialog(item.id)}
                        >
                          <Plus className="w-4 h-4 ml-1" />
                          إضافة
                        </Button>
                      </DialogTrigger>
                      <DialogContent aria-describedby={`dialog-desc-${item.id}`}>
                        <DialogHeader>
                          <DialogTitle>إضافة {item.name} إلى السلة</DialogTitle>
                          <DialogDescription id={`dialog-desc-${item.id}`}>اختر العدد وأضف ملاحظة اختيارية ثم اضغط تم.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm block mb-1">العدد</label>
                            <Input type="number" min={1} value={pendingQty} onChange={(e) => setPendingQty(Math.max(1, parseInt(e.target.value || "1", 10)))} />
                          </div>
                          <div>
                            <label className="text-sm block mb-1">ملاحظة (اختياري)</label>
                            <Input value={pendingNote} onChange={(e) => setPendingNote(e.target.value)} placeholder="مثال: بدون بصل" />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setOpenForId(null)}>إلغاء</Button>
                            <Button onClick={() => confirmAdd(item)}>تم</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-12">
          <Button variant="golden" size="lg" className="px-8">
            عرض القائمة الكاملة
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;