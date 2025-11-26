import { GoogleGenAI } from "@google/genai";
import { AIActionType } from '../types';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for fast text editing tasks, Pro for complex reasoning if needed.
const MODEL_NAME = 'gemini-2.5-flash';

export const streamAIContent = async (
  action: AIActionType,
  context: string,
  userPrompt?: string,
  onChunk?: (text: string) => void
): Promise<string> => {
  let prompt = "";
  let systemInstruction = "You are a helpful AI writing assistant embedded in a document editor. Your output should be direct text content suitable for insertion into a document. Do not wrap in markdown code blocks unless requested. Do not include conversational filler like 'Here is the summary:'.";

  switch (action) {
    case AIActionType.SUMMARIZE:
      prompt = `Summarize the following text concisely:\n\n${context}`;
      break;
    case AIActionType.FIX_SPELLING:
      prompt = `Fix spelling and grammar in the following text, maintaining the original tone:\n\n${context}`;
      break;
    case AIActionType.IMPROVE_WRITING:
      prompt = `Rewrite the following text to be more clear, professional, and concise:\n\n${context}`;
      break;
    case AIActionType.CONTINUE_WRITING:
      prompt = `Continue writing based on the context below. Keep the flow natural:\n\n${context}`;
      break;
    case AIActionType.GENERATE_FROM_PROMPT:
      prompt = `${userPrompt}`;
      if (context) {
        prompt += `\n\nContext to consider:\n${context}`;
      }
      break;
    default:
      prompt = userPrompt || context;
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        if (onChunk) {
          onChunk(fullText);
        }
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// New function for structured data generation (JSON)
export const generateStructuredData = async (context: string): Promise<any> => {
  const prompt = `
    Analyze the following documents and return a strictly valid JSON object (no markdown formatting, no code blocks).
    
    Data to extract:
    1. metrics: { projectHealth (0-100 based on tone), completedTasks (count checked items), totalTasks (count all items), sentiment (Positive/Neutral/Critical) }
    2. topics: Array of top 4 topics/categories found with 'count' (relevance score 1-100) and 'topic' name.
    3. actionItems: Array of specific tasks found. format: { id (random string), task, assignee (infer or "Unassigned"), priority (High/Medium/Low), status (To Do/In Progress/Done) }

    Documents:
    ${context}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No data returned");
    
    // Clean up potential markdown fences if the model ignores instruction
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Structure API Error:", error);
    return null;
  }
}