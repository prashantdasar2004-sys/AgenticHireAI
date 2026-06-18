"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Field, Input, Panel } from "../../components/ui";
import { useAuthStore } from "../../store/authStore";

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const { register, handleSubmit, formState, setError } = useForm();

  async function onSubmit(values) {
    try {
      await signup({ ...values, role: "recruiter" });
      router.push("/dashboard");
    } catch (error) {
      setError("root", { message: error.message });
    }
  }

  return (
    <main className="grid min-h-screen place-items-center p-5">
      <Panel className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Create recruiter account</h1>
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Name"><Input {...register("name", { required: true })} /></Field>
          <Field label="Email"><Input type="email" {...register("email", { required: true })} /></Field>
          <Field label="Password"><Input type="password" {...register("password", { required: true, minLength: 8 })} /></Field>
          {formState.errors.root ? <p className="text-sm text-danger">{formState.errors.root.message}</p> : null}
          <Button type="submit">Sign up</Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          Already registered? <Link className="text-brand" href="/login">Login</Link>
        </p>
      </Panel>
    </main>
  );
}
