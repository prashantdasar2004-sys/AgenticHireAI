"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Button, Field, Input, Panel } from "../../../../components/ui";
import { api } from "../../../../lib/api";

export default function ApplyPage() {
  const params = useParams();
  const jobId = params.jobId;

  const [result, setResult] = useState(null);
  const { register, handleSubmit, formState, setError } = useForm();

  async function onSubmit(values) {
    try {
      const formData = new FormData();

      formData.append("job_id", jobId);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone || "");
      formData.append("resume", values.resume[0]);

      const data = await api("/candidates/upload", {
        method: "POST",
        body: formData,
      });

      setResult(data);
    } catch (error) {
      setError("root", { message: error.message });
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-2xl place-items-center p-5">
      <Panel className="w-full">
        <h1 className="text-2xl font-semibold">Candidate application</h1>

        {result ? (
          <p>Application submitted successfully</p>
        ) : (
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Field label="Name">
              <Input {...register("name", { required: true })} />
            </Field>

            <Field label="Email">
              <Input type="email" {...register("email", { required: true })} />
            </Field>

            <Field label="Phone">
              <Input {...register("phone")} />
            </Field>

            <Field label="Resume PDF">
              <Input
                type="file"
                accept="application/pdf"
                {...register("resume", { required: true })}
              />
            </Field>

            <Button type="submit">Submit application</Button>
          </form>
        )}
      </Panel>
    </main>
  );
}