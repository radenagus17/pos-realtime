import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  orderFormSchema,
  OrderFormSchema,
} from "@/validations/order-validation";
import { INITIAL_ORDER, INITIAL_STATE_ORDER } from "@/constants/order-constant";
import { createOrder } from "../lib/actions";
import FormOrder from "./form-order";
import { useTables } from "@/hooks/use-tables";
import { useSetAtom } from "jotai";
import { selectedTableAtom } from "@/stores/table-store";

export default function DialogCreateOrderDineIn({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const selectedTable = useSetAtom(selectedTableAtom);

  const form = useForm<OrderFormSchema>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: INITIAL_ORDER,
  });

  const { data: tables } = useTables();

  const [createOrderState, createOrderAction, isPendingCreateOrder] =
    useActionState(createOrder, INITIAL_STATE_ORDER);

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
      selectedTable(null);
    }
  }, [createOrderState?.status]);

  return (
    <FormOrder
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateOrder}
      type="Create"
      tables={tables?.data ?? []}
    />
  );
}
