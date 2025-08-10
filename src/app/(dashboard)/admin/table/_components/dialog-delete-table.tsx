import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect } from "react";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { useAtom, useSetAtom } from "jotai";
import { dialogFormAtom } from "@/stores/general-store";
import { selectedTableAtom } from "@/stores/table-store";
import { deleteTable } from "../lib/actions";

export default function DialogDeleteTable({
  refetch,
}: {
  refetch: () => void;
}) {
  const [currentData, setCurrentData] = useAtom(selectedTableAtom);
  const openDialog = useSetAtom(dialogFormAtom);

  const [deleteTableState, deleteTableAction, isPendingDeleteTable] =
    useActionState(deleteTable, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append(
      "id",
      currentData ? (currentData.id?.toString() as string) : ""
    );
    startTransition(() => {
      deleteTableAction(formData);
    });
  };

  useEffect(() => {
    if (deleteTableState?.status === "error") {
      toast.error("Delete Table Failed", {
        description: deleteTableState.errors?._form?.[0],
      });
    }

    if (deleteTableState?.status === "success") {
      toast.success("Delete Table Success");
      openDialog(false);
      setCurrentData(null);
      refetch();
    }
  }, [deleteTableState, refetch, openDialog, setCurrentData]);

  return (
    <DialogDelete
      isLoading={isPendingDeleteTable}
      onSubmit={onSubmit}
      title="Table"
    />
  );
}
