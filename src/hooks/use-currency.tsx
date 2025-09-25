import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrencyEGP } from "@/lib/utils";

type CurrencyContextValue = {
  rateSarToEgp: number | null;
  isLoading: boolean;
  error: Error | null;
  convertFromSarToEgp: (amountSar: number) => number;
  formatFromSarToEgp: (amountSar: number) => string;
  lastUpdated: string | null;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

async function fetchSarToEgpRate(): Promise<{ rate: number; timestamp: string }>
{
  // Using exchangerate.host free API (no key required)
  const res = await fetch(
    "https://api.exchangerate.host/latest?base=SAR&symbols=EGP"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }
  const json = await res.json();
  const rate: number | undefined = json?.rates?.EGP;
  const timestamp: string = json?.date ?? new Date().toISOString();
  if (!rate || !isFinite(rate)) {
    throw new Error("Invalid EGP rate received");
  }
  return { rate, timestamp };
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["fx", "SAR", "EGP"],
    queryFn: fetchSarToEgpRate,
    // Refresh every 1 hour
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
  });

  const value = useMemo<CurrencyContextValue>(() => {
    const rate = data?.rate ?? null;
    const convertFromSarToEgp = (amountSar: number) => {
      if (!rate) return amountSar; // fallback: 1:1 if no rate yet
      return amountSar * rate;
    };
    const formatFromSarToEgp = (amountSar: number) => {
      const egp = convertFromSarToEgp(amountSar);
      return formatCurrencyEGP(egp);
    };
    return {
      rateSarToEgp: rate,
      isLoading,
      error: (error as Error) || null,
      convertFromSarToEgp,
      formatFromSarToEgp,
      lastUpdated: data?.timestamp ?? null,
    };
  }, [data, isLoading, error]);

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}



