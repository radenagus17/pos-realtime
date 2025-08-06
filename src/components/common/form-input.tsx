import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  switch (type) {
    case "textarea":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );

    case "password":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder={placeholder}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );

    default:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  autoComplete="off"
                  type={type}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );
  }
}
