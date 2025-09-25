import { supabase } from "./client";

export type DbOrder = {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{ id: number; name: string; qty: number; price_sar: number; note?: string; image_url?: string; emoji?: string }>;
  total_sar: number;
  status?: 'pending' | 'ready' | 'completed';
  // Optional discount/client-only fields
  discount_code?: string;
  discount_percent?: number;
  discount_amount?: number;
  total_before_discount?: number;
};

const LOCAL_ORDERS_KEY = "app.local.orders";

function readLocalOrders(): DbOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DbOrder[]) : [];
  } catch {
    return [];
  }
}

function writeLocalOrders(orders: DbOrder[]) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export async function createOrder(order: DbOrder): Promise<string | null> {
  // Only send DB columns to Supabase
  const dbPayload = {
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_address: order.customer_address,
    items: order.items,
    total_sar: order.total_sar,
    status: order.status ?? 'pending',
  };
  const { data, error, status } = await supabase.from("orders").insert(dbPayload as any).select("id").single();
  if (!error && data?.id) return data.id;

  // Fallback: store locally on any error (e.g., 400/401/RLS/network)
  if (status && status >= 400) {
    const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const localOrder: DbOrder = {
      ...order,
      id: localId,
      created_at: new Date().toISOString(),
      status: order.status ?? 'pending',
    };
    const existing = readLocalOrders();
    writeLocalOrders([localOrder, ...existing]);
    return localId;
  }

  return null;
}

export async function listOrders(limit = 50): Promise<DbOrder[] | null> {
  const { data, error } = await (supabase as any)
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  const remote = error ? [] : ((data as unknown as DbOrder[]) || []);
  const local = readLocalOrders();
  // Merge local first (most recent at top), then remote
  const merged = [...local, ...remote];
  return merged;
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'ready' | 'completed'): Promise<boolean> {
  // Try remote update first
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (!error) return true;

  // Fallback: update local order
  const local = readLocalOrders();
  const idx = local.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    local[idx] = { ...local[idx], status };
    writeLocalOrders(local);
    return true;
  }
  return false;
}


