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
  const [rates, setRates] = useState<Rates>({ EUR: 1 }); // Podrazumevano je EUR zbog baze

  useEffect(() => {
    // Uzmi najnovije kurseve sa moje api rute
    fetch("/api/convert")
      .then((res) => res.json())
      .then((data) => {
        // Ovde dobijam objekte sa kursnim listama (npr. RSD: 117.2)
        setRates(data);
      })
      .catch((err) => console.error("Problem sa učitavanjem valuta:", err));
  }, []);

  const convertPrice = (priceInEur: number) => {
    // Nađi kurs za izabranu valutu, ako ga nema koristi 1 (EUR)
    const rate = rates[currency] || 1; 
    const converted = priceInEur * rate; 
    
    // Formatiranje broja da izgleda kao prava cena (dodaje din. ili €)
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

// prečica da ne moram svuda useContext(CurrencyContext)
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency mora biti unutar CurrencyProvider-a!");
  return context;
};