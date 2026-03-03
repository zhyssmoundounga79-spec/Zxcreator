import { GoogleGenAI, Type } from "@google/genai";

export const generateIdeas = async (niche: string, platform: string, goal: string) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  const currentAi = new GoogleGenAI({ apiKey });
  const response = await currentAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Niche: ${niche}. Platform: ${platform}. Goal: ${goal}. Generate 20 viral content ideas.`,
    config: {
      systemInstruction: "You are a viral content strategist for Zxcreator. Generate 20 viral content ideas based on the user's niche, platform, and goal. Format the output as a JSON array of objects with 'title', 'description', and 'viralScore' (1-100).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            viralScore: { type: Type.NUMBER },
          },
          required: ["title", "description", "viralScore"],
        },
      },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const generateHooks = async (topic: string, niche: string) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  const currentAi = new GoogleGenAI({ apiKey });
  const response = await currentAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Topic: ${topic}. Niche: ${niche}. Generate 10 powerful hooks.`,
    config: {
      systemInstruction: "You are a copywriting expert. Generate 10 powerful, scroll-stopping hooks for the given topic and niche. Return a JSON array of strings.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const generateScript = async (topic: string, niche: string, platform: string) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  const currentAi = new GoogleGenAI({ apiKey });
  const response = await currentAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Topic: ${topic}. Niche: ${niche}. Platform: ${platform}. Generate a viral script.`,
    config: {
      systemInstruction: "You are an expert scriptwriter for short-form video (TikTok, Reels, Shorts). Create a VIRAL script with the following structure: 1. HOOK (0-3s): Visually and verbally grabbing to stop the scroll. 2. PROBLEM/AGITATION (3-15s): Relatable pain point or curiosity gap. 3. SOLUTION/PAYOFF (15-50s): The hack, insight, or story. 4. CTA: Clear instruction. Tone: Energetic, fast-paced. Include visual cues in brackets [Visual: ...]. Return JSON with fields: 'hook', 'problem', 'solution', 'cta', 'estimatedDuration'.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          problem: { type: Type.STRING },
          solution: { type: Type.STRING },
          cta: { type: Type.STRING },
          estimatedDuration: { type: Type.STRING },
        },
        required: ["hook", "problem", "solution", "cta", "estimatedDuration"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
};

export const generateThumbnails = async (topic: string, niche: string) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  const currentAi = new GoogleGenAI({ apiKey });
  const response = await currentAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Video Topic: ${topic}. Niche: ${niche}. Describe 3 thumbnail concepts.`,
    config: {
      systemInstruction: "You are a YouTube thumbnail designer. Describe 3 high-converting thumbnail concepts for the given video topic. For each, provide: 'visualDescription', 'textOverlay', 'colorScheme', 'emotion'. Return JSON array.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            visualDescription: { type: Type.STRING },
            textOverlay: { type: Type.STRING },
            colorScheme: { type: Type.STRING },
            emotion: { type: Type.STRING },
          },
          required: ["visualDescription", "textOverlay", "colorScheme", "emotion"],
        },
      },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const generateHashtags = async (topic: string, niche: string) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  const currentAi = new GoogleGenAI({ apiKey });
  const response = await currentAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Topic: ${topic}. Niche: ${niche}. Generate 30 relevant, high-reach hashtags.`,
    config: {
      systemInstruction: "You are a social media growth expert. Generate 30 relevant hashtags for the given topic and niche. Categorize them into 'High Volume' (Broad), 'Medium Volume' (Niche), and 'Low Volume' (Specific). Return JSON with fields: 'high', 'medium', 'low' (arrays of strings).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          high: { type: Type.ARRAY, items: { type: Type.STRING } },
          medium: { type: Type.ARRAY, items: { type: Type.STRING } },
          low: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["high", "medium", "low"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
};

export const generateVideo = async (prompt: string) => {
  // Create a new instance right before the call to use the latest selected key
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  const currentAi = new GoogleGenAI({ apiKey });
  
  let operation = await currentAi.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await currentAi.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  return downloadLink;
};
