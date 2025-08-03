import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect } from "react";
import { deleteUser } from "../lib/actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { useAtom, useSetAtom } from "jotai";
import { dialogFormUserAtom, selectedUserAtom } from "@/stores/user-store";

export default function DialogDeleteUser({ refetch }: { refetch: () => void }) {
  const [currentData, setCurrentData] = useAtom(selectedUserAtom);
  const openDialog = useSetAtom(dialogFormUserAtom);

  const [deleteUserState, deleteUserAction, isPendingDeleteUser] =
    useActionState(deleteUser, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    formData.append("avatar_url", currentData!.avatar_url as string);
    startTransition(() => {
      deleteUserAction(formData);
    });
  };

  useEffect(() => {
    if (deleteUserState?.status === "error") {
      toast.error("Delete User Failed", {
        description: deleteUserState.errors?._form?.[0],
      });
    }

    if (deleteUserState?.status === "success") {
      toast.success("Delete User Success");
      openDialog(false);
      setCurrentData(null);
      refetch();
    }
  }, [deleteUserState, refetch, openDialog, setCurrentData]);

  return (
    <DialogDelete
      isLoading={isPendingDeleteUser}
      onSubmit={onSubmit}
      title="User"
    />
  );
}
