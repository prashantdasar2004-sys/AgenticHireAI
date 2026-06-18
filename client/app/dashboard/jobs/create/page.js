"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Field, Input, Panel, Textarea } from "../../../../components/ui";
import { api } from "../../../../lib/api";

export default function CreateJobPage() {
  const router = useRouter();
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      title: "Frontend Developer",
      description: "Build high quality interfaces with React, JavaScript, and CSS.",
      required_skills: "React, JavaScript, CSS",
      preferred_skills: "Next.js, Tailwind CSS",
      min_experience: 0
    }
  });

  async function onSubmit(values) {
    try {
      await api("/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          required_skills: values.required_skills.split(",").map((item) => item.trim()).filter(Boolean),
          preferred_skills: values.preferred_skills.split(",").map((item) => item.trim()).filter(Boolean),
          min_experience: Number(values.min_experience)
        })
      });
      router.push("/dashboard/jobs");
    } catch (error) {
      setError("root", { message: error.message });
    }
  }

  return (
    <Panel className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Create job</h1>
      <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Title"><Input {...register("title", { required: true })} /></Field>
        <Field label="Description"><Textarea {...register("description", { required: true })} /></Field>
        <Field label="Required skills"><Input {...register("required_skills")} /></Field>
        <Field label="Preferred skills"><Input {...register("preferred_skills")} /></Field>
        <Field label="Minimum experience"><Input type="number" min="0" {...register("min_experience")} /></Field>
        {formState.errors.root ? <p className="text-sm text-danger">{formState.errors.root.message}</p> : null}
        <Button type="submit">Create job</Button>
      </form>
    </Panel>
  );
}
