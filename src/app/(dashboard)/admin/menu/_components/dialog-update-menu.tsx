import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateMenu } from "../lib/actions";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import FormMenu from "./form-menu";
import { MenuFormSchema, menuFormSchema } from "@/validations/menu-validation";
import { INITIAL_STATE_MENU } from "@/constants/menu-constant";
import { useAtom, useSetAtom } from "jotai";
import { dialogFormAtom } from "@/stores/general-store";
import { selectedMenuAtom } from "@/stores/menu-store";

export default function DialogUpdateMenu({ refetch }: { refetch: () => void }) {
  const [currentData, setCurrentData] = useAtom(selectedMenuAtom);
  const openDialog = useSetAtom(dialogFormAtom);

  const form = useForm<MenuFormSchema>({
    resolver: zodResolver(menuFormSchema),
  });

  const [updateMenuState, updateMenuAction, isPendingUpdateMenu] =
    useActionState(updateMenu, INITIAL_STATE_MENU);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    if (currentData?.image_url !== data.image_url) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, key === "image_url" ? preview!.file ?? "" : value);
      });
      formData.append("old_image_url", currentData?.image_url ?? "");
    } else {
      Object.entries(data).forEach(([Key, value]) => {
        formData.append(Key, value);
      });
    }
    formData.append(
      "id",
      currentData ? (currentData.id?.toString() as string) : ""
    );

    startTransition(() => {
      updateMenuAction(formData);
    });
  });

  useEffect(() => {
    if (updateMenuState?.status === "error") {
      toast.error("Update Menu Failed", {
        description: updateMenuState.errors?._form?.[0],
      });
    }

    if (updateMenuState?.status === "success") {
      toast.success("Update Menu Success");
      form.reset();
      openDialog(false);
      setCurrentData(null);
      refetch();
    }
  }, [updateMenuState, refetch, form, openDialog, setCurrentData]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name as string);
      form.setValue("description", currentData.description as string);
      form.setValue("price", currentData?.price?.toString() as string);
      form.setValue("discount", currentData?.discount?.toString() as string);
      form.setValue("category", currentData.category as string);
      form.setValue(
        "is_available",
        currentData?.is_available?.toString() as string
      );
      form.setValue("image_url", currentData.image_url as string);
      setPreview({
        file: new File([], currentData.image_url as string),
        displayUrl: currentData.image_url as string,
      });
    }
  }, [currentData, form]);

  return (
    <FormMenu
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingUpdateMenu}
      type="Update"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
