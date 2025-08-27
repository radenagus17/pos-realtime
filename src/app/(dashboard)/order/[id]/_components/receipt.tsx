import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import { MenuTypes } from "@/types/menu";
import { OrderMenuTypes, OrderTypes } from "@/types/order";
import { TableTypes } from "@/types/table";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Receipt = ({
  order,
  orderMenu,
  orderId,
}: {
  order: OrderTypes;
  orderMenu: OrderMenuTypes[] | null;
  orderId: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu ?? []);

  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <div className="relative">
      <Button onClick={reactToPrintFn}>Print Receipt</Button>
      <div
        ref={contentRef}
        className="w-full flex flex-col p-8 absolute -z-10 top-0"
      >
        <h4 className="text-2xl font-bold text-center pb-4 border-b border-dashed">
          POS Realtime
        </h4>
        <div className="py-4 border-b border-dashed text-sm space-y-2">
          <p>
            Bill No: <span className="font-bold">{orderId}</span>
          </p>
          <p>
            Table:{" "}
            <span className="font-bold">
              {(order?.tables as TableTypes)?.name}
            </span>
          </p>
          <p>
            Customer: <span className="font-bold">{order?.customer_name}</span>
          </p>
          <p>
            Date:{" "}
            <span className="font-bold">
              {new Date(order.created_at as Date).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2 py-4 border-b border-dashed text-sm">
          {orderMenu?.length &&
            orderMenu.map((item) => {
              const { name, price } = item.menus as MenuTypes;

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <p>
                    {name} x {item.quantity}
                  </p>
                  <p>{convertIDR(price! * item.quantity!)}</p>
                </div>
              );
            })}
        </div>
        <div className="flex flex-col gap-2 py-4 text-sm">
          <div className="flex justify-between items-center">
            <p>Subtotal</p>
            <p>{convertIDR(totalPrice)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Tax</p>
            <p>{convertIDR(tax)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Service</p>
            <p>{convertIDR(service)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Total</p>
            <p>{convertIDR(grandTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
