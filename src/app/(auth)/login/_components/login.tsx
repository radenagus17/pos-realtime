"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";
import { startTransition, useActionState, useEffect } from "react";
import { loginAction } from "../actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Login = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const { push } = useRouter();

  const [loginState, loginForm, isPendingLogin] = useActionState(
    loginAction,
    INITIAL_STATE_LOGIN_FORM
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      loginForm(formData);
    });
  });

  useEffect(() => {
    if (loginState?.status === "error") {
      toast.error("Login failed", {
        description: loginState.errors?._form?.[0],
      });

      startTransition(() => {
        loginForm(null);
      });
    } else if (loginState?.status === "success") {
      startTransition(() => {
        loginForm(null);
        push("/");
        toast.success("Login success", {
          description: "Welcome back admin!",
        });
      });
    }
  }, [loginState, push, loginForm]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>Login to access all features</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Input your email"
            />
            <FormInput
              form={form}
              name="password"
              label="Password"
              type="password"
              placeholder="*******"
            />
            <Button disabled={isPendingLogin} type="submit">
              {isPendingLogin ? (
                <span className="inline-flex gap-2 items-center">
                  <Loader2 className="animate-spin" /> Loading...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
