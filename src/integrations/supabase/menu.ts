import { supabase } from "./client";

export type DbMenuItem = {
  id: number;
  name: string;
  description: string;
  price_sar: number;
  quantity: number | null;
  rating: number | null;
  image: string | null;
  image_url: string | null;
  category: string;
  is_popular: boolean | null;
  updated_at?: string;
  created_at?: string;
};

export async function fetchAllItems(): Promise<DbMenuItem[] | null> {
  const { data, error } = await (supabase as any).from("menu_items").select("*");
  if (error) return null;
  return data as unknown as DbMenuItem[];
}

export async function upsertItem(item: DbMenuItem): Promise<boolean> {
  const { error } = await (supabase as any).from("menu_items").upsert(item, { onConflict: "id" });
  return !error;
}

export async function deleteItem(id: number): Promise<boolean> {
  const { error } = await (supabase as any).from("menu_items").delete().eq("id", id);
  return !error;
}

export async function upsertCategory(name: string): Promise<boolean> {
  const { error } = await (supabase as any).from("menu_categories").upsert({ name }, { onConflict: "name" });
  return !error;
}

export async function fetchAllCategories(): Promise<string[] | null> {
  const { data, error } = await (supabase as any).from("menu_categories").select("name");
  if (error) return null;
  return (data as { name: string }[]).map((r) => r.name);
}

export async function logAudit(action: string, payload: unknown): Promise<void> {
  try {
    await (supabase as any).from("menu_audit_logs").insert({ action, payload });
  } catch {}
}


