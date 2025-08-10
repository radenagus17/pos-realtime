import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect } from "react";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { useAtom, useSetAtom } from "jotai";
import { dialogFormAtom } from "@/stores/general-store";
import { selectedMenuAtom } from "@/stores/menu-store";
import { deleteMenu } from "../lib/actions";

export default function DialogDeleteMenu({ refetch }: { refetch: () => void }) {
  const [currentData, setCurrentData] = useAtom(selectedMenuAtom);
  const openDialog = useSetAtom(dialogFormAtom);

  const [deleteMenuState, deleteMenuAction, isPendingDeleteMenu] =
    useActionState(deleteMenu, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append(
      "id",
      currentData ? (currentData.id?.toString() as string) : ""
    );
    formData.append("image_url", currentData!.image_url as string);
    startTransition(() => {
      deleteMenuAction(formData);
    });
  };

  useEffect(() => {
    if (deleteMenuState?.status === "error") {
      toast.error("Delete Menu Failed", {
        description: deleteMenuState.errors?._form?.[0],
      });
    }

    if (deleteMenuState?.status === "success") {
      toast.success("Delete Menu Success");
      openDialog(false);
      setCurrentData(null);
      refetch();
    }
  }, [deleteMenuState, refetch, openDialog, setCurrentData]);

  return (
    <DialogDelete
      isLoading={isPendingDeleteMenu}
      onSubmit={onSubmit}
      title="Menu"
    />
  );
}
