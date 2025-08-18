"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetQueryParams } from "@/lib/utils";
import { FILTER_MENU } from "@/constants/order-constant";
import { parseAsString, useQueryState, UseQueryStateOptions } from "nuqs";
import LoadingCardMenu from "./loading-card-menu";
import CardMenu from "./card-menu";
import { useMemo, useState, useTransition } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounce-callback";
import CartSection from "./cart";
import { CartTypes, OrderTypes } from "@/types/order";
import { MenuTypes } from "@/types/menu";
import { addOrderItem } from "../../../lib/actions";

export default function AddOrderItem({
  orderId,
  query,
}: {
  orderId: string;
  query: GetQueryParams;
}) {
  const queryStateOptions = useMemo<
    Omit<UseQueryStateOptions<string>, "parse"> & { debounceMs: number }
  >(() => {
    return {
      history: "replace",
      scroll: false,
      shallow: true,
      throttleMs: 50,
      debounceMs: 300,
    };
  }, []);
  const supabase = createClient();
  const [filterCategory, setFilterCategory] = useQueryState(
    "category",
    parseAsString
      .withOptions(queryStateOptions)
      .withDefault(query.category || "")
  );
  const [searchName, setSearchName] = useQueryState(
    "name",
    parseAsString.withOptions(queryStateOptions).withDefault(query.name || "")
  );

  const [carts, setCarts] = useState<CartTypes[]>([]);

  const [isPendingAddItem, startAddItem] = useTransition();

  const debouncedSetFilterValues = useDebouncedCallback(
    setSearchName,
    queryStateOptions.debounceMs
  );

  const { data: menus, isLoading: isLoadingMenu } = useQuery({
    queryKey: ["menus", searchName, filterCategory],
    queryFn: async () => {
      const resMenus = supabase
        .from("menus")
        .select("*", { count: "exact" })
        .order("created_at")
        .eq("is_available", true)
        .ilike("name", `%${searchName}%`);

      if (filterCategory) {
        resMenus.eq("category", filterCategory);
      }

      const result = await resMenus;

      if (result.error)
        toast.error("Get Menu data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const result = await supabase
        .from("orders")
        .select("id, customer_name, status, payment_token, tables (name, id)")
        .eq("order_id", orderId)
        .single();

      if (result.error)
        toast.error("Get Order data failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!orderId,
  });

  const handleAddToCart = (
    menu: MenuTypes,
    action: "increment" | "decrement"
  ) => {
    const existingItem = carts.find((item) => +item.menu_id === menu.id);
    if (existingItem) {
      if (action === "decrement") {
        if (existingItem.quantity > 1) {
          setCarts(
            carts.map((item) =>
              +item.menu_id === menu.id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    total: item.total - (menu.price || 0),
                  }
                : item
            )
          );
        } else {
          setCarts(carts.filter((item) => +item.menu_id !== menu.id));
        }
      } else {
        setCarts(
          carts.map((item) =>
            +item.menu_id === menu.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  total: item.total + (menu.price || 0),
                }
              : item
          )
        );
      }
    } else {
      setCarts([
        ...carts,
        {
          menu_id: String(menu.id),
          quantity: 1,
          total: Number(menu.price),
          notes: "",
          menu,
        },
      ]);
    }
  };

  const handleOrder = async () => {
    const payload = {
      carts: carts.map((item) => ({
        order_id: order?.id ?? "",
        status: "pending",
        ...item,
      })),
      invoice: orderId ?? "",
    };

    startAddItem(() => {
      addOrderItem(payload);
    });
  };

  return (
    <article className="flex flex-col lg:flex-row gap-4 w-full px-4 py-6">
      <section className="space-y-4 lg:w-2/3">
        <div className="flex flex-col items-center justify-between gap-4 w-full lg:flex-row">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <h1 className="text-2xl font-bold">Menu</h1>
            <div className="flex gap-2">
              {FILTER_MENU.map((item) => (
                <Button
                  key={item.value}
                  onClick={() => setFilterCategory(item.value)}
                  variant={
                    filterCategory === item.value ? "default" : "outline"
                  }
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <Input
            placeholder="Search..."
            onChange={(e) => debouncedSetFilterValues(e.target.value)}
          />
        </div>
        {isLoadingMenu && !menus ? (
          <LoadingCardMenu />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-4">
            {menus?.data?.map((menu) => (
              <CardMenu
                menu={menu}
                key={`menu-${menu.id}`}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
        {!isLoadingMenu && menus?.data?.length === 0 && (
          <div className="text-center w-full">Menu not found</div>
        )}
      </section>
      <section className="lg:w-1/3">
        <CartSection
          order={order as Partial<OrderTypes>}
          carts={carts}
          setCarts={setCarts}
          onAddToCart={handleAddToCart}
          onOrder={handleOrder}
          isLoading={isPendingAddItem}
        />
      </section>
    </article>
  );
}
