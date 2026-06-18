import { Resend } from "resend";
import { loadSpec } from "../utils/specLoader.js";

function render(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || "");
}

export async function renderAndSendEmail(templateKey, values) {
  const templates = await loadSpec("email/templates.json");
  const template = templates[templateKey] || templates.hold;
  const message = {
    to: values.to,
    subject: render(template.subject, values),
    body: render(template.body, values)
  };

  if (!process.env.RESEND_API_KEY) {
    return { provider: "console", sent: false, ...message };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM || "AgenticHireAI <onboarding@resend.dev>",
    to: values.to,
    subject: message.subject,
    text: message.body
  });

  return { provider: "resend", sent: true, id: response.data?.id, ...message };
}
