import { renderAndSendEmail } from "../emails/email.service.js";

export async function runEmailAgent({
  candidate,
  job,
  shortlisting,
}) {

  console.log("SHORTLISTING DATA:");
  console.log(shortlisting.data);

  const templateKey =
    shortlisting.data.decision === "shortlist"
      ? "interview"
      : shortlisting.data.decision;

  const email = await renderAndSendEmail(
    templateKey,
    {
      to: candidate.email,
      candidateName: candidate.name,
      jobTitle: job.title,
    }
  );

  console.log("========== EMAIL RESULT ==========");
  console.log(email);
  console.log("=================================");

  return {
    success: true,
    data: email,
  };
}