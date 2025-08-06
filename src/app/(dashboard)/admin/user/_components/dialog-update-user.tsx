import { INITIAL_STATE_UPDATE_USER_FORM } from "@/constants/user-constant";
import { Preview } from "@/types/general";
import {
  UpdateUserForm,
  updateUserSchemaForm,
} from "@/validations/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormUser from "./form-user";
import { updateUserAction } from "../lib/actions";
import { useAtom, useSetAtom } from "jotai";
import { selectedUserAtom } from "@/stores/user-store";
import { dialogFormAtom } from "@/stores/general-store";

export default function DialogUpdateUser({ refetch }: { refetch: () => void }) {
  const [currentData, setCurrentData] = useAtom(selectedUserAtom);
  const openDialog = useSetAtom(dialogFormAtom);

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchemaForm),
  });

  const [updateUserState, updateUserForm, isPendingUpdateUser] = useActionState(
    updateUserAction,
    INITIAL_STATE_UPDATE_USER_FORM
  );

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    if (currentData?.avatar_url !== data.avatar_url) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          key === "avatar_url" ? preview!.file ?? "" : value
        );
      });
      formData.append("old_avatar_url", currentData?.avatar_url ?? "");
    } else {
      Object.entries(data).forEach(([Key, value]) => {
        formData.append(Key, value);
      });
    }
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateUserForm(formData);
    });
  });

  useEffect(() => {
    if (updateUserState?.status === "error") {
      toast.error("Update User Failed", {
        description: updateUserState.errors?._form?.[0],
      });
    }

    if (updateUserState?.status === "success") {
      toast.success("Update User Success");
      form.reset();
      openDialog(false);
      setCurrentData(null);
      refetch();
    }
  }, [updateUserState, refetch, form, openDialog, setCurrentData]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name as string);
      form.setValue("role", currentData.role as string);
      form.setValue("avatar_url", currentData.avatar_url as string);
      setPreview({
        file: new File([], currentData.avatar_url as string),
        displayUrl: currentData.avatar_url as string,
      });
    }
  }, [currentData, form]);

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingUpdateUser}
      type="Update"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
