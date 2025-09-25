import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/hooks/use-currency";
import { useMenuStore } from "@/hooks/use-menu-store";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "@/integrations/supabase/orders";

const AdminDashboard = () => {
  const { state, updateItem, removeItem, addItem, addCategory } = useMenuStore();
  const { formatFromSarToEgp } = useCurrency();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const ok = sessionStorage.getItem("admin.ok");
    // Soft guard; the login page will set this
    if (ok !== "1") {
      // no redirect to keep it simple for now
    }
  }, []);

  const filtered = state.items.filter((i) =>
    i.name.includes(filter) || i.category.includes(filter)
  );

  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      const data = await listOrders();
      if (data) setOrders(data as any[]);
    };
    load();
    const refresh = () => load();
    window.addEventListener("admin:orders:refresh", refresh as EventListener);
    return () => window.removeEventListener("admin:orders:refresh", refresh as EventListener);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">لوحة الادارة</h1>
        <Link to="/admin">
          <Button variant="outline">عودة</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex gap-3 items-end">
          <div className="flex-1">
            <Label htmlFor="search">بحث</Label>
            <Input id="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="ابحث بالاسم أو الفئة" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-3">المشتريات الأخيرة</h2>
          {orders.length === 0 ? (
            <div className="text-sm text-muted-foreground">لا توجد مشتريات بعد.</div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="border rounded p-3">
                  <div className="text-sm">الاسم: {o.customer_name} — الهاتف: {o.customer_phone}</div>
                  <div className="text-sm">العنوان: {o.customer_address}</div>
                  <div className="text-xs text-muted-foreground mt-1">الإجمالي (SAR): {o.total_sar}</div>
                  {Array.isArray(o.items) && o.items.length > 0 && (
                    <div className="mt-2 text-sm">
                      <div className="font-semibold mb-1">العناصر:</div>
                      <ul className="list-disc pr-5 space-y-1">
                        {o.items.map((it: any, idx: number) => (
                          <li key={idx}>
                            {it.name} × {it.qty} {it.note ? <span className="text-xs text-muted-foreground">— ملاحظة: {it.note}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground">الاسم</div>
                <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground">الوصف</div>
                <Input value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">السعر (SAR)</div>
                <Input type="number" value={item.priceSar} onChange={(e) => updateItem(item.id, { priceSar: parseFloat(e.target.value) || 0 })} />
                <div className="text-xs text-muted-foreground mt-1">{formatFromSarToEgp(item.priceSar)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">الكمية</div>
                <Input type="number" value={item.quantity ?? 1} onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value || "1", 10) })} />
              </div>
              <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">الفئة</div>
                  <Input value={item.category} onChange={(e) => updateItem(item.id, { category: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">رابط الصورة</div>
                  <Input value={item.imageUrl ?? ""} onChange={(e) => updateItem(item.id, { imageUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="destructive" onClick={() => removeItem(item.id)}>حذف</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-2">إضافة نوع جديد سريعاً</div>
          <QuickAdd addItem={addItem} addCategory={addCategory} />
        </CardContent>
      </Card>
    </div>
  );
};

function QuickAdd({ addItem, addCategory }: { addItem: ReturnType<typeof useMenuStore>["addItem"]; addCategory: ReturnType<typeof useMenuStore>["addCategory"]; }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("1");
  const [cat, setCat] = useState("أطباق رئيسية");
  const [img, setImg] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = parseFloat(price) || 0;
    const q = parseInt(qty || "1", 10);
    addCategory(cat);
    addItem({ name: name || "صنف جديد", description: desc || "بدون وصف", priceSar: p, quantity: q, category: cat, image: "🍽️", imageUrl: img || undefined, rating: 4.5 });
    setName(""); setDesc(""); setPrice(""); setQty("1"); setCat("أطباق رئيسية"); setImg("");
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <div>
        <Label htmlFor="n">الاسم</Label>
        <Input id="n" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="d">الوصف</Label>
        <Input id="d" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="p">السعر (SAR)</Label>
        <Input id="p" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="q">الكمية</Label>
        <Input id="q" value={qty} onChange={(e) => setQty(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="c">الفئة</Label>
        <Input id="c" value={cat} onChange={(e) => setCat(e.target.value)} />
      </div>
      <div className="md:col-span-6">
        <Label htmlFor="i">رابط الصورة</Label>
        <Input id="i" value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://..." />
      </div>
      <div className="md:col-span-6 flex gap-2">
        <Button type="submit">إضافة</Button>
      </div>
    </form>
  );
}

export default AdminDashboard;



