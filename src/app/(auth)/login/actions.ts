"use server";

import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import z from "zod";

export async function loginAction(
  prevState: AuthFormState,
  formData: FormData | null
): Promise<AuthFormState> {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }

  const validatedFields = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);
    return { status: "error", errors: { ...fieldErrors, _form: [] } };
  }

  const supabase = await createClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (profile) {
    const cookiesStore = await cookies();
    cookiesStore.set("user_profile", JSON.stringify(profile), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    errors: undefined,
  };
}
