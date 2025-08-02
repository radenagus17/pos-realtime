import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER_FORM,
} from "@/constants/user-constant";
import {
  CreateUserForm,
  createUserSchemaForm,
} from "@/validations/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FC, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUserAction } from "../lib/actions";

interface DialogCreateUserProps {
  refetch: () => void;
  closeDialog: () => void;
}

const DialogCreateUser: FC<DialogCreateUserProps> = ({
  refetch,
  closeDialog,
}) => {
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
      formData.append(key, value);
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
      toast.success("Succeffully", {
        description: "Create user success",
      });
      form.reset();
      closeDialog();
      refetch();
    }
  }, [createUserState, createUserForm, form, refetch, closeDialog]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create user</DialogTitle>
        <DialogDescription>register a new user</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Input your name"
          />
          <FormInput
            form={form}
            name="email"
            label="Email"
            placeholder="Input your email"
          />
          <FormInput
            form={form}
            name="role"
            label="Role"
            placeholder="Input your role"
          />
          <FormInput
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="*******"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button disabled={isPendingCreateUser} type="submit">
              {isPendingCreateUser ? (
                <span className="inline-flex gap-2 items-center">
                  <Loader2 className="animate-spin" /> Loading...
                </span>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default DialogCreateUser;
