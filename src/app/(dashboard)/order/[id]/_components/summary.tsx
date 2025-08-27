import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePricing } from "@/hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import { OrderMenuTypes, OrderTypes } from "@/types/order";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { generatePayment } from "../../lib/actions";
import { INITIAL_STATE_GENERATE_PAYMENT } from "@/constants/order-constant";
import { toast } from "sonner";
import { profileAtom } from "@/stores/auth-store";
import { useAtomValue } from "jotai";

export default function Summary({
  order,
  orderMenu,
  id,
}: {
  order: Pick<OrderTypes, "customer_name" | "tables" | "status">;
  orderMenu: OrderMenuTypes[];
  id: string;
}) {
  const isAllServed = useMemo(() => {
    return orderMenu?.every((item) => item.status === "served");
  }, [orderMenu]);

  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

  const profile = useAtomValue(profileAtom);

  const [
    generatePaymentState,
    generatePaymentAction,
    isPendingGeneratePayment,
  ] = useActionState(generatePayment, INITIAL_STATE_GENERATE_PAYMENT);

  const handleGeneratePayment = () => {
    const formData = new FormData();
    formData.append("id", id || "");
    formData.append("gross_amount", grandTotal.toString());
    formData.append("customer_name", order?.customer_name || "");
    startTransition(() => {
      generatePaymentAction(formData);
    });
  };

  useEffect(() => {
    if (generatePaymentState?.status === "error") {
      toast.error("Generate Payment Failed", {
        description: generatePaymentState.errors?._form?.[0],
      });
    }

    if (generatePaymentState?.status === "success") {
      window.snap.pay(generatePaymentState.data.payment_token);
    }
  }, [generatePaymentState?.status]);

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
                value={
                  (order?.tables as unknown as { name: string })?.name ||
                  "Takeaway"
                }
                disabled
              />
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm">Subtotal</p>
            <p className="text-sm">{convertIDR(totalPrice)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Tax (12%)</p>
            <p className="text-sm">{convertIDR(tax)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Service (5%)</p>
            <p className="text-sm">{convertIDR(service)}</p>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold">{convertIDR(grandTotal)}</p>
          </div>
          {order?.status === "process" && profile.role !== "kitchen" && (
            <Button
              type="submit"
              onClick={handleGeneratePayment}
              disabled={
                !isAllServed || isPendingGeneratePayment || !!!orderMenu?.length
              }
              className="w-full font-semibold bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"
            >
              {isPendingGeneratePayment ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Pay"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
