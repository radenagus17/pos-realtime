import z from "zod";

export const tableFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  capacity: z.string().min(1, "Capacity is required"),
  status: z.string().min(1, "Status is required"),
});

export const tableSchema = z.object({
  name: z.string(),
  description: z.string(),
  capacity: z.number(),
  status: z.string(),
});

export type TableFormSchema = z.infer<typeof tableFormSchema>;
export type TableSchema = z.infer<typeof tableSchema> & { id: string };
