"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Address = {
  line1: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

export type Order = {
  order_id: string;
  email: string;
  address: Address;
  card: string;
};

const OrderContext = createContext<{
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;
}>({
  lastOrder: null,
  setLastOrder: () => {},
});

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  return (
    <OrderContext.Provider value={{ lastOrder, setLastOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
