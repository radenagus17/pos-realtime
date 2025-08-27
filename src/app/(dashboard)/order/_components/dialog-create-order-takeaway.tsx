import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  orderTakeawayFormSchema,
  OrderTakeawaySchema,
} from "@/validations/order-validation";
import {
  INITIAL_ORDER_TAKEAWAY,
  INITIAL_STATE_ORDER_TAKEAWAY,
} from "@/constants/order-constant";
import { createOrderTakeaway } from "../lib/actions";
import FormOrder from "./form-order";

export default function DialogCreateOrderTakeaway({
  refetch,
  closeDialog,
}: {
  refetch: () => void;
  closeDialog: () => void;
}) {
  const form = useForm<OrderTakeawaySchema>({
    resolver: zodResolver(orderTakeawayFormSchema),
    defaultValues: INITIAL_ORDER_TAKEAWAY,
  });

  const [createOrderState, createOrderAction, isPendingCreateOrder] =
    useActionState(createOrderTakeaway, INITIAL_STATE_ORDER_TAKEAWAY);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createOrderAction(formData);
    });
  });

  useEffect(() => {
    if (createOrderState?.status === "error") {
      toast.error("Create order failed", {
        description: createOrderState.errors?._form?.[0],
      });
    } else if (createOrderState?.status === "success") {
      toast.success("Successfully", {
        description: "Create order success",
      });
      form.reset();
      closeDialog();
      refetch();
    }
  }, [createOrderState?.status]);

  return (
    <FormOrder
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateOrder}
      type="Takeaway"
    />
  );
}
