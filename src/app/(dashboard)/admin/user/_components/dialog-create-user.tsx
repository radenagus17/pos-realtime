import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER_FORM,
} from "@/constants/user-constant";
import {
  CreateUserForm,
  createUserSchemaForm,
} from "@/validations/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FC,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUserAction } from "../lib/actions";
import FormUser from "./form-user";

interface DialogCreateUserProps {
  refetch: () => void;
  closeDialog: () => void;
}

const DialogCreateUser: FC<DialogCreateUserProps> = ({
  refetch,
  closeDialog,
}) => {
  const [preview, setPreview] = useState<
    { file: File; displayUrl: string } | undefined
  >(undefined);

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchemaForm),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserForm, isPendingCreateUser] = useActionState(
    createUserAction,
    INITIAL_STATE_CREATE_USER_FORM
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, key === "avatar_url" ? preview!.file ?? "" : value);
    });

    startTransition(() => {
      createUserForm(formData);
    });
  });

  useEffect(() => {
    if (createUserState?.status === "error") {
      toast.error("Create user failed", {
        description: createUserState.errors?._form?.[0],
      });
    } else if (createUserState?.status === "success") {
      toast.success("Successfully", {
        description: "Create user success",
      });
      form.reset();
      setPreview(undefined);
      closeDialog();
      refetch();
    }
  }, [createUserState, createUserForm, form, refetch, closeDialog]);

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateUser}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
};

export default DialogCreateUser;
