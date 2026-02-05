"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Rates = { [key: string]: number };

interface CurrencyContextType {
  currency: string;
  rates: Rates;
  setCurrency: (currency: string) => void;
  convertPrice: (priceInEur: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState("EUR");
  const [rates, setRates] = useState<Rates>({ EUR: 1 }); // EUR je baza

  useEffect(() => {
    // Pozivamo tvoju novu API rutu
    fetch("/api/convert")
      .then((res) => res.json())
      .then((data) => {
        // Pošto je tvoja baza verovatno u EUR, a API vraća odnos RSD -> Ostalo, 
        // ovde ćemo prilagoditi da EUR bude baza ako treba, 
        // ili jednostavno koristiti dobijene podatke.
        setRates(data);
      })
      .catch((err) => console.error("Greška kod valuta:", err));
  }, []);

  const convertPrice = (priceInEur: number) => {
  const rate = rates[currency] || 1; // npr. ako je valuta RSD, rate će biti 117.2
  const converted = priceInEur * rate; 
  
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: currency,
  }).format(converted);
};

  return (
    <CurrencyContext.Provider value={{ currency, rates, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};