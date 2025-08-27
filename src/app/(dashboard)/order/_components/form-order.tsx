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
import { STATUS_ORDER_LIST } from "@/constants/order-constant";
import { TableTypes } from "@/types/table";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormOrder<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  tables = [],
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  tables?: TableTypes[] | [];
  type: "Create" | "Update" | "Takeaway";
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Order</DialogTitle>
          <DialogDescription>
            {type === "Create"
              ? "Create a new order"
              : type === "Takeaway"
                ? "Create a new takeaway order"
                : "Make changes order here"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            form={form}
            name={"customer_name" as Path<T>}
            label="Customer Name"
            placeholder="Insert customer name here"
          />
          {tables.length > 0 && (
            <FormSelect
              form={form}
              name={"table_id" as Path<T>}
              label="Table"
              selectItem={tables.map((table) => ({
                value: `${table.id}`,
                label: `${table.name} - ${table.status} (${table.capacity})`,
                disabled: table.status !== "available",
              }))}
            />
          )}
          {type === "Create" && (
            <FormSelect
              form={form}
              name={"status" as Path<T>}
              label="Status"
              selectItem={STATUS_ORDER_LIST}
            />
          )}
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
                "Order"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
