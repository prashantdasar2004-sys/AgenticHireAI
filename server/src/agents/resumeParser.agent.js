import fs from "fs/promises";
import pdf from "pdf-parse";
import Groq from "groq-sdk";

export async function runResumeParser({ candidate }) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const buffer = await fs.readFile(candidate.resume_url);
  const parsed = await pdf(buffer);

  const resumeText = parsed.text.slice(0, 12000);

  const prompt = `
You are an expert resume parser.

Extract information from the resume.

Return ONLY valid JSON.

{
  "name": "",
  "skills": [],
  "experience": 0,
  "education": "",
  "projects": [],
  "certifications": []
}

Resume:

${resumeText}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.1,
  });

  const content = response.choices[0].message.content;

  const cleanContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("========== GROQ RESPONSE ==========");
  console.log(content);
  console.log("===================================");

  let data;

  try {
    data = JSON.parse(cleanContent);
    console.log("✅ JSON PARSED SUCCESSFULLY");
  } catch (error) {
    console.log("❌ JSON PARSE FAILED");
    console.log(error.message);

    data = {
      name: candidate.name,
      skills: [],
      experience: 0,
      education: "",
      projects: [],
      certifications: [],
      raw_response: content,
    };
  }

  return {
    success: true,
    data,
  };
}