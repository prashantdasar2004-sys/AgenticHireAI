import Groq from "groq-sdk";

export async function runInterviewAgent({
  job,
  hiringSpec,
  parsedResume,
}) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const skills =
    parsedResume?.data?.skills || [];

  const prompt = `
You are a Senior Technical Interviewer.

Candidate Skills:
${skills.join(", ")}

Job Role:
${job.title}

Generate:

{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ],
  "coding_task": "",
  "rubric": []
}

Rules:
- Questions must be technical.
- Questions must be personalized to candidate skills.
- Return ONLY JSON.
`;

  const response =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

  const content =
    response.choices[0].message.content;

  const cleanContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let data;

  try {
    data = JSON.parse(cleanContent);
  } catch {
    data = {
      questions: [
        "Explain one project from your resume.",
      ],
      coding_task:
        `Build a feature related to ${job.title}`,
      rubric: [
        "technical depth",
        "problem solving",
      ],
    };
  }

  return {
    success: true,
    data: {
      rounds:
        hiringSpec.interview_rounds || 3,
      ...data,
    },
  };
}