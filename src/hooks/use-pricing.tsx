import { MenuTypes } from "@/types/menu";
import { OrderMenuTypes } from "@/types/order";
import { useMemo } from "react";

export function usePricing(orderMenu: OrderMenuTypes[]) {
  const totalPrice = useMemo(() => {
    let total = 0;
    orderMenu.forEach((item) => {
      const menus = item.menus as MenuTypes | undefined;
      total += (menus?.price || 0) * (item.quantity || 1);
    });
    return total;
  }, [orderMenu]);

  const tax = useMemo(() => {
    return Math.round(totalPrice * 0.12);
  }, [totalPrice]);

  const service = useMemo(() => {
    return Math.round(totalPrice * 0.05);
  }, [totalPrice]);

  const grandTotal = useMemo(() => {
    return totalPrice + tax + service;
  }, [totalPrice, tax, service]);

  return {
    totalPrice,
    tax,
    service,
    grandTotal,
  };
}
