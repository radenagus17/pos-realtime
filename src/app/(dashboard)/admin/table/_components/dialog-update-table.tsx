import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormTable from "./form-table";
import { updateTable } from "../lib/actions";
import { useAtom, useSetAtom } from "jotai";
import { dialogFormAtom } from "@/stores/general-store";
import { selectedTableAtom } from "@/stores/table-store";
import { INITIAL_STATE_TABLE } from "@/constants/table-constant";
import {
  tableFormSchema,
  TableFormSchema,
} from "@/validations/table-validation";

export default function DialogUpdateTable({
  refetch,
}: {
  refetch: () => void;
}) {
  const [currentData, setCurrentData] = useAtom(selectedTableAtom);
  const openDialog = useSetAtom(dialogFormAtom);

  const form = useForm<TableFormSchema>({
    resolver: zodResolver(tableFormSchema),
  });

  const [updateTableState, updateTableForm, isPendingUpdateTable] =
    useActionState(updateTable, INITIAL_STATE_TABLE);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append(
      "id",
      currentData ? (currentData.id?.toString() as string) : ""
    );

    startTransition(() => {
      updateTableForm(formData);
    });
  });

  useEffect(() => {
    if (updateTableState?.status === "error") {
      toast.error("Update Table Failed", {
        description: updateTableState.errors?._form?.[0],
      });
    }

    if (updateTableState?.status === "success") {
      toast.success("Update Table Success");
      form.reset();
      openDialog(false);
      setCurrentData(null);
      refetch();
    }
  }, [updateTableState, refetch, form, openDialog, setCurrentData]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData?.name as string);
      form.setValue("description", currentData?.description as string);
      form.setValue("capacity", currentData?.capacity?.toString() as string);
      form.setValue("status", currentData?.status as string);
    }
  }, [currentData, form]);

  return (
    <FormTable
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingUpdateTable}
      type="Update"
    />
  );
}
