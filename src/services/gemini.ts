import { GoogleGenAI } from "@google/genai";

/**
 * Gemini Service for server-side AI operations.
 * This service handles communication with the Google Gemini API.
 */

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

interface GeminiOptions {
  expectJson?: boolean;
  image?: string;
}

/**
 * callGemini
 * @param prompt - The text prompt for the model
 * @param options - Configuration for JSON response and optional image
 * @returns - The generated text or parsed JSON object
 */
export async function callGemini(prompt: string, options: GeminiOptions = {}) {
  const { expectJson = false, image } = options;

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from environment variables.");
    throw new Error("Gemini API key is not configured. Please check your environment settings.");
  }

  const parts: any[] = [{ text: prompt }];

  if (image) {
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    if (base64Data) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      });
    }
  }

  let lastError: any;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: expectJson ? "application/json" : "text/plain",
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text returned from Gemini.");
      }

      if (expectJson) {
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error("Failed to parse Gemini response as JSON:", text);
          throw new Error("The AI returned an invalid JSON structure.");
        }
      }

      return text;
    } catch (error: any) {
      lastError = error;
      console.error(`Gemini attempt ${attempt + 1} failed:`, error.message || error);
      
      // Retry on 503 (Service Unavailable) or 429 (Rate Limit)
      const errorStr = JSON.stringify(error).toLowerCase();
      const isRetryable = errorStr.includes("503") || errorStr.includes("429") || errorStr.includes("overburdened") || errorStr.includes("high demand");
      
      if (isRetryable && attempt < 2) {
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }

  // Fallback to OpenRouter if all attempts fail or a fatal error occurs
  if (process.env.OPENROUTER_API_KEY) {
      try {
        console.log("Attempting OpenRouter fallback...");
        return await callOpenRouterFallback(prompt, expectJson, image);
      } catch (orError) {
        console.error("OpenRouter fallback also failed:", orError);
      }
    }

    throw new Error(lastError?.message || "Failed to communicate with AI services.");
}

/**
 * Fallback to OpenRouter using Fetch (since it doesn't have an official SDK like Gemini)
 */
async function callOpenRouterFallback(prompt: string, expectJson: boolean, image?: string) {
  const messages: any[] = [{ role: 'user', content: prompt }];
  if (image) {
    messages[0].content = [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: image } }
    ];
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://ai.studio",
      "X-Title": "IELTS Master BD",
    },
    body: JSON.stringify({
      model: "google/gemini-pro-1.5",
      messages: messages,
      response_format: expectJson ? { type: "json_object" } : undefined
    }),
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) throw new Error("Empty response from OpenRouter");
  
  return expectJson ? JSON.parse(content) : content;
}
