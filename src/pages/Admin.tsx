import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMenuStore } from "@/hooks/use-menu-store";

const Admin = () => {
  const { categories, addCategory, addItem, resetToDefaults } = useMenuStore();
  const [passwordOk, setPasswordOk] = useState(false);
  const [password, setPassword] = useState("");

  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const saved = localStorage.getItem("app.admin.name");
      if (saved) setAdminName(saved);
    } catch {}
  }, []);
  function saveAdminName(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem("app.admin.name", adminName.trim());
    } catch {}
  }

  const [newCategory, setNewCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState(categories[1] ?? "أطباق رئيسية");
  const [itemImageUrl, setItemImageUrl] = useState("");

  // Discount configuration (multiple codes)
  type DiscountDef = { code: string; percent: number };
  const [discountCodes, setDiscountCodes] = useState<DiscountDef[]>([]);
  const [newDiscountCode, setNewDiscountCode] = useState("");
  const [newDiscountPercent, setNewDiscountPercent] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("app.discount.codes");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setDiscountCodes(parsed as DiscountDef[]);
      } else {
        // migrate legacy single code if exists
        const legacyCode = localStorage.getItem("app.discount.code");
        const legacyPercentRaw = localStorage.getItem("app.discount.percent");
        const legacyPercent = Math.max(0, Math.min(100, parseFloat(legacyPercentRaw || "0") || 0));
        if (legacyCode && legacyPercent > 0) {
          const migrated: DiscountDef[] = [{ code: legacyCode, percent: legacyPercent }];
          setDiscountCodes(migrated);
          localStorage.setItem("app.discount.codes", JSON.stringify(migrated));
        }
      }
    } catch {}
  }, []);
  function addDiscount(e: React.FormEvent) {
    e.preventDefault();
    const code = (newDiscountCode || "").trim();
    const p = Math.max(0, Math.min(100, parseFloat(newDiscountPercent || "0") || 0));
    if (!code || p <= 0) return;
    const existsIdx = discountCodes.findIndex((d) => d.code.toLowerCase() === code.toLowerCase());
    const updated = existsIdx >= 0
      ? discountCodes.map((d, i) => (i === existsIdx ? { code, percent: p } : d))
      : [{ code, percent: p }, ...discountCodes];
    setDiscountCodes(updated);
    try { localStorage.setItem("app.discount.codes", JSON.stringify(updated)); } catch {}
    setNewDiscountCode("");
    setNewDiscountPercent("");
  }
  function removeDiscount(code: string) {
    const updated = discountCodes.filter((d) => d.code.toLowerCase() !== code.toLowerCase());
    setDiscountCodes(updated);
    try { localStorage.setItem("app.discount.codes", JSON.stringify(updated)); } catch {}
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem("app.admin.name", adminName.trim());
    } catch {}
    if (password === "admin") {
      sessionStorage.setItem("admin.ok", "1");
      setPasswordOk(true);
      navigate("/admin/dashboard");
    }
  }

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    addCategory(newCategory);
    setNewCategory("");
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    const price = parseFloat(itemPrice);
    if (!isFinite(price)) return;
    addItem({
      name: itemName || "طبق بدون اسم",
      description: itemDescription || "بدون وصف",
      priceSar: price,
      category: itemCategory,
      image: "🍽️",
      imageUrl: itemImageUrl || undefined,
      rating: 4.5,
      isPopular: false,
    });
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemImageUrl("");
  }

  if (!passwordOk) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">الادارة</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="adminNameLogin">اسم المشرف</Label>
                <Input id="adminNameLogin" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="اكتب اسمك هنا" />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" />
              </div>
              <Button type="submit">دخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">الادارة</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">بيانات المشرف</h2>
            <form onSubmit={saveAdminName} className="space-y-3">
              <div>
                <Label htmlFor="adminName">اسم المشرف</Label>
                <Input id="adminName" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="اكتب اسمك هنا" />
              </div>
              <Button type="submit">حفظ</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">أكواد الخصم</h2>
            <form onSubmit={addDiscount} className="space-y-3">
              <div>
                <Label htmlFor="discountCodeNew">كود الخصم</Label>
                <Input id="discountCodeNew" value={newDiscountCode} onChange={(e) => setNewDiscountCode(e.target.value)} placeholder="مثال: SAVE10" />
              </div>
              <div>
                <Label htmlFor="discountPercentNew">نسبة الخصم (%)</Label>
                <Input id="discountPercentNew" type="number" min={0} max={100} value={newDiscountPercent} onChange={(e) => setNewDiscountPercent(e.target.value)} placeholder="مثال: 10" />
              </div>
              <Button type="submit">إضافة/تحديث الكود</Button>
            </form>
            {discountCodes.length > 0 ? (
              <div className="pt-4 space-y-2">
                <div className="text-sm text-muted-foreground">الأكواد الحالية:</div>
                {discountCodes.map((d) => (
                  <div key={d.code} className="flex items-center justify-between border rounded px-3 py-2">
                    <div className="text-sm">{d.code} — {d.percent}%</div>
                    <Button variant="destructive" size="sm" onClick={() => removeDiscount(d.code)}>حذف</Button>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">إضافة فئة</h2>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <Label htmlFor="category">اسم الفئة</Label>
                <Input id="category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="مثال: سندويتشات" />
              </div>
              <Button type="submit">إضافة</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">إضافة طبق</h2>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <Label htmlFor="name">اسم الطبق</Label>
                <Input id="name" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="اسم الطبق" />
              </div>
              <div>
                <Label htmlFor="desc">الوصف</Label>
                <Input id="desc" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="وصف مختصر" />
              </div>
              <div>
                <Label htmlFor="price">السعر (SAR)</Label>
                <Input id="price" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="مثال: 45" />
              </div>
              <div>
                <Label htmlFor="cat">الفئة</Label>
                <Input id="cat" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} placeholder="مثال: أطباق رئيسية" />
              </div>
              <div>
                <Label htmlFor="img">رابط الصورة (اختياري)</Label>
                <Input id="img" value={itemImageUrl} onChange={(e) => setItemImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <Button type="submit">إضافة</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="flex gap-3">
        <Button variant="outline" onClick={resetToDefaults}>إعادة القائمة للوضع الافتراضي</Button>
        <Button onClick={() => navigate("/admin/dashboard")}>فتح لوحة التحكم</Button>
      </div>
    </div>
  );
};

export default Admin;


