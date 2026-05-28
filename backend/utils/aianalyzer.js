import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const analyzeResumeWithAI = async (resumeText, jobRole) => {

  if (!process.env.AI_API_KEY) {
    console.log("⚠️ No AI API key found. Returning mock data.");
    return {
      overall_score: 75,
      ats_score: 70,
      skills_score: 80,
      experience_score: 65,
      education_score: 85,
      strengths: ["Good technical foundation"],
      weaknesses: ["Needs more measurable achievements"],
      suggestions: [
        "Add quantified results",
        "Improve formatting consistency",
        "Include more relevant keywords"
      ],
      skills_found: ["React", "Node.js"],
      missing_skills: ["Docker", "CI/CD"]
    };
  }

  const currentYear = new Date().getFullYear();

  const prompt = `
You are an expert ATS resume analyzer for fresher-level candidates.

The candidate is applying for the role of: ${jobRole || "a general software position"}.
Tailor your analysis and missing_skills based on this specific role.

Assume the current year is ${currentYear}.
Do NOT treat dates up to ${currentYear} as future dates.
If a date represents expected graduation or ongoing education, do not flag it as an error.
Only flag years beyond ${currentYear} as future dates.

Resume Text:
${resumeText}

Return ONLY valid JSON in this format:

{
  "overall_score": number,
  "ats_score": number,
  "skills_score": number,
  "experience_score": number,
  "education_score": number,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "skills_found": [],
  "missing_skills": []
}
`;

  const response = await fetch(
    `https://api.groq.com/openai/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq Error:", data);
    throw new Error("Groq API Error");
  }

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    console.error("Invalid OpenAI response:", data);
    throw new Error("Invalid OpenAI response");
  }

  const clean = text.replace(/```json|```/g, "").trim();

  // ✅ Extract just the JSON object even if there's text around it
const jsonMatch = clean.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  console.error("No JSON found in response:", clean);
  throw new Error("AI returned invalid JSON format");
}

try {
  return JSON.parse(jsonMatch[0]);
} catch (err) {
  console.error("JSON Parse Error:", jsonMatch[0]);
  throw new Error("AI returned invalid JSON format");
}
};