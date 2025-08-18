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
import { createMenuAction } from "../lib/actions";
import { INITIAL_MENU, INITIAL_STATE_MENU } from "@/constants/menu-constant";
import { menuFormSchema, MenuFormSchema } from "@/validations/menu-validation";
import FormMenu from "./form-menu";

interface DialogCreateMenuProps {
  refetch: () => void;
  closeDialog: () => void;
}

const DialogCreateMenu: FC<DialogCreateMenuProps> = ({
  refetch,
  closeDialog,
}) => {
  const [preview, setPreview] = useState<
    { file: File; displayUrl: string } | undefined
  >(undefined);

  const form = useForm<MenuFormSchema>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: INITIAL_MENU,
  });

  const [createMenuState, createMenuForm, isPendingCreateMenu] = useActionState(
    createMenuAction,
    INITIAL_STATE_MENU
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, key === "image_url" ? preview!.file ?? "" : value);
    });

    startTransition(() => {
      createMenuForm(formData);
    });
  });

  useEffect(() => {
    if (createMenuState?.status === "error") {
      toast.error("Create menu failed", {
        description: createMenuState.errors?._form?.[0],
      });
    } else if (createMenuState?.status === "success") {
      toast.success("Successfully", {
        description: "Create menu success",
      });
      form.reset();
      setPreview(undefined);
      closeDialog();
      refetch();
    }
  }, [createMenuState?.status]);

  return (
    <FormMenu
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateMenu}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
};

export default DialogCreateMenu;
