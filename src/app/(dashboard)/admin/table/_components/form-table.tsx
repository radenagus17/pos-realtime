import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
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
import { STATUS_TABLE_LIST } from "@/constants/table-constant";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormTable<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Table</DialogTitle>
          <DialogDescription>
            {type === "Create"
              ? "Create a new table"
              : "Make changes table here"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            form={form}
            name={"name" as Path<T>}
            label="Name"
            placeholder="Insert table name"
          />
          <FormInput
            form={form}
            name={"description" as Path<T>}
            label="Description"
            placeholder="Insert description here"
            type="textarea"
          />
          <FormInput
            form={form}
            name={"capacity" as Path<T>}
            label="Capacity"
            placeholder="Insert capacity here"
            type="number"
          />
          <FormSelect
            form={form}
            name={"status" as Path<T>}
            label="Status"
            selectItem={STATUS_TABLE_LIST}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="inline-flex gap-2 items-center">
                  <Loader2 className="animate-spin" /> Loading
                </span>
              ) : (
                type
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
