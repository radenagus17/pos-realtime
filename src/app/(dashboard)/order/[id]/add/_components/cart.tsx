import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDebouncedCallback } from "@/hooks/use-debounce-callback";
import { convertIDR } from "@/lib/utils";
import { MenuTypes } from "@/types/menu";
import { CartTypes, OrderTypes } from "@/types/order";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function CartSection({
  order,
  carts,
  setCarts,
  onAddToCart,
  isLoading,
  onOrder,
}: {
  order: Pick<OrderTypes, "customer_name" | "tables" | "status"> | null;
  carts: CartTypes[];
  setCarts: Dispatch<SetStateAction<CartTypes[]>>;
  onAddToCart: (item: MenuTypes, type: "decrement" | "increment") => void;
  isLoading: boolean;
  onOrder: () => void;
}) {
  const handleAddNote = (id: string, notes: string) => {
    setCarts(
      carts.map((item) => (item.menu_id === id ? { ...item, notes } : item))
    );
  };

  const debounceAddNote = useDebouncedCallback(handleAddNote, 500);

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        {order && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={order?.customer_name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Table</Label>
              <Input
                value={(order?.tables as unknown as { name: string })?.name}
                disabled
              />
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cart</h3>
          {carts.length > 0 ? (
            carts?.map((item: CartTypes) => (
              <div key={item.menu.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.menu.image_url as string}
                      alt={item.menu.name || "Menu Image"}
                      width={30}
                      height={30}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm">{item.menu.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {convertIDR(item.total / item.quantity)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{convertIDR(item.total)}</p>
                </div>
                <div className="flex items-center gap-4 w-full">
                  <Input
                    placeholder="Add Note"
                    className="w-full"
                    onChange={(e) =>
                      debounceAddNote(item.menu_id, e.target.value)
                    }
                  />
                  <div className="flex items-center gap-4">
                    <Button
                      className="font-semibold cursor-pointer"
                      variant="outline"
                      onClick={() => onAddToCart(item.menu!, "decrement")}
                    >
                      -
                    </Button>
                    <p className="font-semibold">{item.quantity}</p>
                    <Button
                      className="font-semibold cursor-pointer"
                      variant="outline"
                      onClick={() => onAddToCart(item.menu!, "increment")}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm">No item in cart</p>
          )}
          <Button
            onClick={() => onOrder()}
            className="w-full font-semibold bg-teal-500 hover:bg-teal-600 cursor-pointer text-white"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
