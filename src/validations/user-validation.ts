import z from "zod";

export const createUserSchemaForm = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  avatar_url: z.union([
    z.string().min(1, "Image is required"),
    z.instanceof(File),
  ]),
});

export const updateUserSchemaForm = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  avatar_url: z.union([
    z.string().min(1, "Image URL is required"),
    z.instanceof(File),
  ]),
});

export type CreateUserForm = z.infer<typeof createUserSchemaForm>;
export type UpdateUserForm = z.infer<typeof updateUserSchemaForm>;
