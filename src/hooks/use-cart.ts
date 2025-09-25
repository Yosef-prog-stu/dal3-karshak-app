import { useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number; // menu item id
  name: string;
  priceSar: number;
  quantity: number;
  imageUrl?: string;
  emoji?: string;
  note?: string;
};

type CartState = {
  items: CartItem[];
};

const STORAGE_KEY = "app.cart.v1";

function readStorage(): CartState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CartState;
  } catch {
    return null;
  }
}

function writeStorage(state: CartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useCart() {
  const [state, setState] = useState<CartState>(() => readStorage() ?? { items: [] });

  useEffect(() => {
    writeStorage(state);
  }, [state]);

  const totalQuantity = useMemo(() => state.items.reduce((a, c) => a + c.quantity, 0), [state.items]);
  const totalPriceSar = useMemo(() => state.items.reduce((a, c) => a + c.quantity * c.priceSar, 0), [state.items]);

  function addItem(item: Omit<CartItem, "quantity">, qty: number = 1) {
    setState((s) => {
      const existing = s.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: s.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty, note: item.note ?? i.note } : i)),
        };
      }
      return { items: [...s.items, { ...item, quantity: qty }] };
    });
  }

  function setItemQty(id: number, qty: number) {
    if (qty <= 0) return removeItem(id);
    setState((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)) }));
  }

  function removeItem(id: number) {
    setState((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  }

  function clear() {
    setState({ items: [] });
  }

  return { state, addItem, setItemQty, removeItem, clear, totalQuantity, totalPriceSar };
}


