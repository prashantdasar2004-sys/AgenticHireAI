"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Field, Input, Panel } from "../../components/ui";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState, setError } = useForm();

  async function onSubmit(values) {
    try {
      await login(values);
      router.push("/dashboard");
    } catch (error) {
      setError("root", { message: error.message });
    }
  }

  return (
    <main className="grid min-h-screen place-items-center p-5">
      <Panel className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Recruiter login</h1>
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Email">
            <Input type="email" {...register("email", { required: true })} />
          </Field>
          <Field label="Password">
            <Input type="password" {...register("password", { required: true })} />
          </Field>
          {formState.errors.root ? <p className="text-sm text-danger">{formState.errors.root.message}</p> : null}
          <Button type="submit">Login</Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          New recruiter? <Link className="text-brand" href="/signup">Create an account</Link>
        </p>
      </Panel>
    </main>
  );
}
