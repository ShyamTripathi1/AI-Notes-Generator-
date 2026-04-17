import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateNotes = async (params) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "Groq API Key is not configured. Please add GROQ_API_KEY to your .env.local file."
    );
  }

  const {
    subject = "",
    topic = "",
    fieldOfStudy = "General",
    difficulty = "Intermediate",
    purpose = "Exam preparation",
    length = "Detailed",
    level = "College",
    examType = "General",
    weakAreas = [],
  } = params;

  const weakAreasText =
    weakAreas && weakAreas.length > 0
      ? `The student previously struggled with: ${weakAreas.join(", ")}. Give those areas extra depth and explanation.`
      : "";

  const systemPrompt = `You are an elite academic professor and Senior Curriculum Designer specializing in ${fieldOfStudy}. 
Your job is to generate industrial-grade, highly sophisticated, and exam-oriented academic notes in valid JSON format.
Notes must be exhaustive, authoritative, and structured for maximum logical flow. 
You MUST respond with ONLY a valid JSON object - no markdown code fences, no extra text, no explanation outside JSON.`;

  const userPrompt = `Generate the ULTIMATE comprehensive academic notes for:
Subject: ${subject || topic}
Topic: ${topic}
Field of Study: ${fieldOfStudy}
Difficulty: ${difficulty}
Detail Level: ${length}
Target Audience: ${level} students
Exam Type: ${examType}
${weakAreasText}

STRICT REQUIREMENTS:
- shortQuestions: EXACTLY 5 high-yield items
- longQuestions: EXACTLY 5 comprehensive items
- importantQuestions: EXACTLY 5 high-frequency exam items with reasoning
- practiceSection.mcqs: EXACTLY 8 items with 'explanation'
- detailedExplanation: AT LEAST 6-8 granular subtopics with 'examTip'
- revisionNotes: MUST include 'summary' and 'revisionCheatSheet'
- visualAids: PROVIDE 3-4 specialized Mermaid diagrams
- Provide significantly more detail than standard. Return ONLY this exact JSON structure:
{
  "topicOverview": {
    "explanation": "3-4 paragraph introduction",
    "definitions": ["Term: definition"],
    "realWorldExamples": ["Example"]
  },
  "detailedExplanation": [
    { 
      "subtopic": "Name", 
      "explanation": "Detailed text.", 
      "deepdive": "Advanced theory.", 
      "example": "Case example.",
      "examTip": "Tested pattern/Common mistake."
    }
  ],
  "keyPoints": ["Fact 1", "Fact 2"],
  "shortQuestions": [{ "q": "Q", "a": "A" }],
  "longQuestions": [{ "q": "Q", "a": "A" }],
  "importantQuestions": [
    { "q": "Q", "reason": "Reason" }
  ],
  "revisionNotes": {
    "summary": "Summary.",
    "memoryTricks": "Mnemonic.",
    "revisionCheatSheet": ["Fact 1", "Fact 2"]
  },
  "visualAids": [
    { "title": "Title", "type": "mermaid", "content": "mermaid_code" }
  ],
  "algorithmsAndCode": [
    { "title": "Title", "language": "code", "code": "code", "explanation": "expl" }
  ],
  "practiceSection": {
    "mcqs": [
            { "q": "Q", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "Why" }
    ]
  },
  "metadata": {
    "subject": "${subject || topic}",
    "estimatedStudyTime": "Time",
    "difficultyTags": ["Tag"]
  }
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    let text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("No response received from Groq API.");
    }

    // Robust JSON cleaning to handle markdown fences
    if (text.includes("```")) {
      text = text.replace(/```json\n?|```/g, "").trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to generate notes. " + error.message);
  }
};
