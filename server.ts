import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { callGemini } from "./src/services/gemini";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

async function callLLM(prompt: string, expectJson: boolean = false, image?: string) {
  return callGemini(prompt, { expectJson, image });
}

// API routes
app.post("/api/generate-listening", async (req, res) => {
  const { topic } = req.body;
  const prompt = `Generate a short IELTS Listening practice passage (Section 1 style — everyday conversation, 
e.g. booking, registration, directions). Break it into 8-10 segments of 3-4 words each.
Return as JSON array: ["segment 1 words", "segment 2 words", ...]
Topic: ${topic || "booking a hotel"}`;

  try {
    const data = await callLLM(prompt, true);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate listening content" });
  }
});

app.post("/api/evaluate-listening", async (req, res) => {
  const { original, user } = req.body;
  const prompt = `Original segments: ${JSON.stringify(original)}
User typed: ${JSON.stringify(user)}
Calculate word-level accuracy percentage. List which segments had errors and what the error was.
Respond in Bengali explaining mistakes simply. Return JSON:
{ "accuracy_percent": 85, "mistakes": [{"segment_index": 2, "expected": "...", "got": "...", "explanation_bengali": "..."}] }`;

  try {
    const data = await callLLM(prompt, true);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

app.post("/api/generate-reading", async (req, res) => {
  const { type, topic } = req.body;
  const prompt = `Generate a short IELTS Reading passage (150-200 words), ${type || 'Academic'} style,
on topic: ${topic || 'technology'}.
Return plain text only.`;

  try {
    const text = await callLLM(prompt, false);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate reading content" });
  }
});

app.post("/api/evaluate-reading", async (req, res) => {
  const { original, transcribed } = req.body;
  const prompt = `Original passage: ${original}
User's spoken transcript (from speech-to-text): ${transcribed}
Compare word-by-word. Calculate reading accuracy percentage. List specific words that seem mispronounced or skipped.
Respond in Bengali. Return JSON:
{ "accuracy_percent": 90, "issues": ["word1", "word2"], "feedback_bengali": "..." }`;

  try {
    const data = await callLLM(prompt, true);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

app.post("/api/evaluate-writing", async (req, res) => {
  const { task, studentText, image } = req.body;
  
  const prompt = `You are an expert IELTS examiner. Evaluate this IELTS Writing response.
Task: ${task}
Student response: ${studentText || "See image"}

Score each criterion 1-9 (0.5 increments): Task Achievement, Coherence & Cohesion, 
Lexical Resource, Grammatical Range & Accuracy. Overall = average rounded to nearest 0.5.

Return JSON:
{
  "ta_score": 6.5, "cc_score": 6.0, "lr_score": 7.0, "gra_score": 6.5, "overall_band": 6.5,
  "ta_feedback_bengali": "...", "cc_feedback_bengali": "...", 
  "lr_feedback_bengali": "...", "gra_feedback_bengali": "...",
  "strengths_bengali": "...", "improvements_bengali": "...", "model_answer": "..."
}`;

  try {
    const data = await callLLM(prompt, true, image);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

app.post("/api/generate-speaking-questions", async (req, res) => {
  const { part, topic } = req.body;
  const prompt = `Generate IELTS Speaking Part ${part || 1} questions about: ${topic || 'hobbies'}.
Return as JSON array of strings, in English.`;

  try {
    const data = await callLLM(prompt, true);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

app.post("/api/evaluate-speaking", async (req, res) => {
  const { part1, part2, part3, cueCard } = req.body;
  const prompt = `You are an IELTS Speaking examiner. Evaluate these transcripts:
Part 1: ${part1}
Part 2 Cue Card: ${cueCard} | Response: ${part2}  
Part 3: ${part3}

Score 1-9 each: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.
Return JSON with scores, overall_band, bengali feedback per criterion, top_3_mistakes_bengali array, tips_bengali.`;

  try {
    const data = await callLLM(prompt, true);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

// Subscription Status
app.get("/api/subscription/status", (req, res) => {
  res.json({ subscribed: true }); // Default to true for testing
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
