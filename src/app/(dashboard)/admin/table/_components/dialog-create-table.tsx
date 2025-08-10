import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTable } from "../lib/actions";
import { toast } from "sonner";
import {
  TableFormSchema,
  tableFormSchema,
} from "@/validations/table-validation";
import { INITIAL_STATE_TABLE, INITIAL_TABLE } from "@/constants/table-constant";
import FormTable from "./form-table";

export default function DialogCreateTable({
  refetch,
  closeDialog,
}: {
  refetch: () => void;
  closeDialog: () => void;
}) {
  const form = useForm<TableFormSchema>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: INITIAL_TABLE,
  });

  const [createTableState, createTableAction, isPendingCreateTable] =
    useActionState(createTable, INITIAL_STATE_TABLE);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createTableAction(formData);
    });
  });

  useEffect(() => {
    if (createTableState?.status === "error") {
      toast.error("Create table failed", {
        description: createTableState.errors?._form?.[0],
      });
    } else if (createTableState?.status === "success") {
      toast.success("Successfully", {
        description: "Create table success",
      });
      form.reset();
      closeDialog();
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTableState?.status]);

  return (
    <FormTable
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateTable}
      type="Create"
    />
  );
}
