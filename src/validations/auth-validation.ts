import z from "zod";

export const loginSchemaForm = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password required"),
});

export type LoginForm = z.infer<typeof loginSchemaForm>;
