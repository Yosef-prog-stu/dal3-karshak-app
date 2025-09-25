import { useEffect, useMemo, useState } from "react";
import { fetchAllCategories, fetchAllItems, upsertItem as dbUpsertItem, deleteItem as dbDeleteItem, upsertCategory as dbUpsertCategory, logAudit } from "@/integrations/supabase/menu";

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  priceSar: number;
  quantity?: number;
  rating?: number;
  image?: string; // emoji fallback
  imageUrl?: string; // remote image
  category: string;
  isPopular?: boolean;
};

export type MenuState = {
  categories: string[];
  items: MenuItem[];
  nextId: number;
};

const STORAGE_KEY = "app.menu.v1";

const defaultState: MenuState = {
  categories: ["جميع الأطباق", "أطباق رئيسية", "مشاوي", "مقبلات", "سلطات", "حلويات"],
  items: [
    {
      id: 1,
      name: "كبسة اللحم الفاخرة",
      description: "أرز بسمتي فاخر مع لحم طري متبّل بتوابل عربية أصيلة",
      priceSar: 85,
      quantity: 1,
      rating: 4.9,
      image: "🍛",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb4ROMwK_r0ZX1mXHzYVAEz0WOOFBnvvxQBA&s",
      category: "أطباق رئيسية",
      isPopular: true,
    },
    {
      id: 2,
      name: "مشاوي مشكلة",
      description: "تشكيلة مشاوي مميزة: كباب، شيش طاووق، وكفتة مع صوصات",
      priceSar: 95,
      quantity: 1,
      rating: 4.8,
      image: "🍖",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6jO-uUwEWTen5wrKKuMk5D0mvpCqaOeSLKw&s",
      category: "مشاوي",
      isPopular: true,
    },
    {
      id: 3,
      name: "فتة بلحمة",
      description: "خبز محمّص مع أرز ولحم طري وزبادي وصلصة طحينة",
      priceSar: 25,
      quantity: 1,
      rating: 4.7,
      image: "🥙",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdYZXuCqVUga4VQUbbr6cgxoVholj87MI2hQ&s",
      category: "مقبلات",
    },
    {
      id: 4,
      name: "فراخ مشوية بالأعشاب",
      description: "دجاج مشوي متبّل بالأعشاب العطرية ومشوي إلى الكمال",
      priceSar: 65,
      quantity: 1,
      rating: 4.6,
      image: "🍗",
      imageUrl: "https://www.cairo24.com/Upload/libfiles/130/3/0.jpeg",
      category: "أطباق رئيسية",
    },
    {
      id: 5,
      name: "شاورما المعلم",
      description: "شاورما لحم/دجاج ملفوفة بخبز طازج مع ثوم ومخللات",
      priceSar: 30,
      quantity: 1,
      rating: 4.5,
      image: "🥗",
      imageUrl: "https://s3.eu-central-1.amazonaws.com/qatar-delicious/ItemsImages/ItemImage_10631_(0).jpg",
      category: "سلطات",
    },
    {
      id: 6,
      name: "مشكل حلويات",
      description: "تشكيلة مختارة من الحلويات الشرقية الطازجة",
      priceSar: 40,
      quantity: 1,
      rating: 4.9,
      image: "🍰",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBdbCLeP86Fn5X3x3wuGvwRr431zDtvzDxw&s",
      category: "حلويات",
    },
  ],
  nextId: 7,
};

function readStorage(): MenuState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MenuState;
  } catch {
    return null;
  }
}

function writeStorage(state: MenuState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useMenuStore() {
  const [state, setState] = useState<MenuState>(() => readStorage() ?? defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    writeStorage(state);
  }, [state]);

  // Hydrate from Supabase if available
  useEffect(() => {
    (async () => {
      try {
        const [dbItems, dbCats] = await Promise.all([fetchAllItems(), fetchAllCategories()]);
        if (dbItems && dbItems.length > 0) {
          setState((s) => ({
            categories: dbCats && dbCats.length ? Array.from(new Set([...(dbCats as string[])])) : s.categories,
            items: dbItems.map((d) => ({
              id: d.id,
              name: d.name,
              description: d.description,
              priceSar: d.price_sar,
              quantity: d.quantity ?? 1,
              rating: d.rating ?? undefined,
              image: d.image ?? undefined,
              imageUrl: d.image_url ?? undefined,
              category: d.category,
              isPopular: !!d.is_popular,
            })),
            nextId: Math.max(...dbItems.map((x) => x.id)) + 1,
          }));
        }
      } catch {
        // ignore
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  const categories = useMemo(() => Array.from(new Set(state.categories)), [state.categories]);

  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) => ({ ...s, categories: [...new Set([...s.categories, trimmed])] }));
    dbUpsertCategory(trimmed).then(() => logAudit("add_category", { name: trimmed }));
  }

  function addItem(input: Omit<MenuItem, "id">) {
    setState((s) => ({
      ...s,
      items: [...s.items, { quantity: 1, ...input, id: s.nextId }],
      nextId: s.nextId + 1,
    }));
    // Fire and forget DB write
    const payload = { ...input } as MenuItem;
    const id = state.nextId; // approximate id before setState resolves
    // Ensure category exists first to satisfy FK constraint
    dbUpsertCategory(payload.category)
      .then(() =>
        dbUpsertItem({
          id,
          name: payload.name,
          description: payload.description,
          price_sar: payload.priceSar,
          quantity: payload.quantity ?? 1,
          rating: payload.rating ?? null,
          image: payload.image ?? null,
          image_url: payload.imageUrl ?? null,
          category: payload.category,
          is_popular: payload.isPopular ?? null,
        })
      )
      .then(() => logAudit("add_item", { id, ...payload }))
      .catch(() => {/* noop */});
  }

  function updateItem(id: number, changes: Partial<MenuItem>) {
    setState((s) => ({
      ...s,
      items: s.items.map((it) => (it.id === id ? { ...it, ...changes } : it)),
    }));
    // Persist
    const item = state.items.find((i) => i.id === id);
    const merged = { ...item, ...changes } as MenuItem;
    if (merged) {
      dbUpsertCategory(merged.category)
        .then(() => dbUpsertItem({
          id: merged.id,
          name: merged.name,
          description: merged.description,
          price_sar: merged.priceSar,
          quantity: merged.quantity ?? 1,
          rating: merged.rating ?? null,
          image: merged.image ?? null,
          image_url: merged.imageUrl ?? null,
          category: merged.category,
          is_popular: merged.isPopular ?? null,
        }))
        .then(() => logAudit("update_item", { id, changes }))
        .catch(() => {/* noop */});
    }
  }

  function removeItem(id: number) {
    setState((s) => ({
      ...s,
      items: s.items.filter((it) => it.id !== id),
    }));
    dbDeleteItem(id).then(() => logAudit("delete_item", { id }));
  }

  function resetToDefaults() {
    setState(defaultState);
  }

  return {
    state,
    categories,
    addCategory,
    addItem,
    updateItem,
    removeItem,
    resetToDefaults,
  };
}


