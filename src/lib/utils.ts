import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryParamsSchema = z.object({
  page: z.coerce.number().default(1),
  size: z.coerce.number().default(10),
  name: z.string().optional(),
});

export type GetQueryParams = z.infer<typeof queryParamsSchema>;
