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
};

export async function createOrder(order: DbOrder): Promise<string | null> {
  const { data, error } = await supabase.from("orders").insert(order).select("id").single();
  if (error) return null;
  return data?.id ?? null;
}

export async function listOrders(limit = 50): Promise<DbOrder[] | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return null;
  return data as unknown as DbOrder[];
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'ready' | 'completed'): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  return !error;
}


