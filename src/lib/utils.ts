import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency utilities
export type CurrencyCode = "EGP" | "SAR" | "USD" | "EUR";

export function formatCurrencyEGP(amountInEgp: number): string {
  if (!isFinite(amountInEgp)) return "EGP\u00A00.00";
  try {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amountInEgp);
  } catch {
    return `${amountInEgp.toFixed(0)} ج.م`;
  }
}

export function tryParsePriceTextToNumber(text: string): number | null {
  // Extract digits and decimal separator; supports Arabic/English numerals
  const normalized = text
    .replace(/[\u0660-\u0669]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48))
    .replace(/[^0-9.,]/g, "")
    .replace(/,/g, ".");
  const value = parseFloat(normalized);
  return isNaN(value) ? null : value;
}