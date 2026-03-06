import { Router } from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import { db } from '../../db';

const router = Router();

// Costs in credits
const COSTS = {
  IDEAS: 5,
  HOOKS: 5,
  SCRIPT: 10,
  THUMBNAILS: 5,
  HASHTAGS: 5,
  VIDEO: 50,
};

// Helper to clean JSON string
const cleanJsonString = (text: string) => {
  if (!text) return "";
  let clean = text.replace(/```json\n?|```/g, "").trim();
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');

  if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    return clean.substring(firstBrace, lastBrace + 1);
  }
  
  if (firstBracket !== -1 && lastBracket !== -1) {
    return clean.substring(firstBracket, lastBracket + 1);
  }

  return clean;
};

// Middleware to check auth
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

// Helper to deduct credits atomically
const deductCredits = (userId: number, amount: number) => {
  const result = db.prepare('UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?').run(amount, userId, amount);
  if (result.changes === 0) {
    throw new Error('Solde insuffisant. Veuillez recharger vos crédits.');
  }
  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
  return user.balance;
};

// Initialize Gemini
const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

router.post('/generate-ideas', requireAuth, async (req: any, res) => {
  const { niche, platform, goal } = req.body;
  const userId = req.user.id; // Set by auth middleware (need to ensure it is)

  try {
    // Check balance first
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    if (user.balance < COSTS.IDEAS) {
      return res.status(403).json({ error: 'Solde insuffisant' });
    }

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Niche: ${niche}. Platform: ${platform}. Goal: ${goal}. 
      First, use Google Search to find the latest trending topics, news, and viral formats related to this niche on ${platform} for the current week.
      Then, generate 20 viral content ideas that leverage these specific trends.
      For each idea, explain WHY it is trending or viral right now (e.g., "Uses the trending 'X' audio", "Newsjacking 'Y' event").`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a viral content strategist for Zxcreator. Your goal is to generate highly targeted, trend-jacking content ideas. You MUST use Google Search to find real-time trends before generating ideas. Format the output as a JSON array of objects with 'title', 'description', 'viralScore' (1-100), and 'trendSource' (explanation of the trend).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              viralScore: { type: Type.NUMBER },
              trendSource: { type: Type.STRING },
            },
            required: ["title", "description", "viralScore", "trendSource"],
          },
        },
      },
    });

    const cleanedText = cleanJsonString(response.text || "[]");
    const ideas = JSON.parse(cleanedText);

    // Deduct credits only if successful
    const newBalance = deductCredits(userId, COSTS.IDEAS);

    res.json({ ideas, newBalance });
  } catch (error: any) {
    console.error("Error generating ideas:", error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/generate-hooks', requireAuth, async (req: any, res) => {
  const { topic, niche } = req.body;
  const userId = req.user.id;

  try {
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    if (user.balance < COSTS.HOOKS) return res.status(403).json({ error: 'Solde insuffisant' });

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Topic: ${topic}. Niche: ${niche}. Generate 10 powerful hooks.`,
      config: {
        systemInstruction: "You are a copywriting expert. Generate 10 powerful, scroll-stopping hooks for the given topic and niche. For each hook, provide the text, a 'type' (e.g., 'Question', 'Negative', 'Story', 'Statement', 'List'), and a predicted 'viralScore' (1-100). Return a JSON array of objects.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              type: { type: Type.STRING },
              viralScore: { type: Type.NUMBER },
            },
            required: ["hook", "type", "viralScore"],
          },
        },
      },
    });

    const cleanedText = cleanJsonString(response.text || "[]");
    const hooks = JSON.parse(cleanedText);

    const newBalance = deductCredits(userId, COSTS.HOOKS);
    res.json({ hooks, newBalance });
  } catch (error: any) {
    console.error("Error generating hooks:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-script', requireAuth, async (req: any, res) => {
  const { topic, niche, platform, length, tone } = req.body;
  const userId = req.user.id;

  try {
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    if (user.balance < COSTS.SCRIPT) return res.status(403).json({ error: 'Solde insuffisant' });

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Topic: ${topic}. Niche: ${niche}. Platform: ${platform}. Length: ${length}. Tone: ${tone}. Generate a viral script.`,
      config: {
        systemInstruction: "You are an expert scriptwriter for short-form video (TikTok, Reels, Shorts). Create a VIRAL script with the following structure: 1. HOOK (0-3s): Visually and verbally grabbing to stop the scroll. 2. PROBLEM/AGITATION (3-15s): Relatable pain point or curiosity gap. 3. SOLUTION/PAYOFF (15-50s): The hack, insight, or story. 4. CTA: Clear instruction. Tone: Energetic, fast-paced. Include visual cues in brackets [Visual: ...]. Return JSON with fields: 'hook', 'problem', 'solution', 'cta', 'estimatedDuration', 'viralScore' (1-100), and 'scriptType' (e.g., 'Educational', 'Storytelling', 'Controversial').",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            problem: { type: Type.STRING },
            solution: { type: Type.STRING },
            cta: { type: Type.STRING },
            estimatedDuration: { type: Type.STRING },
            viralScore: { type: Type.NUMBER },
            scriptType: { type: Type.STRING },
          },
          required: ["hook", "problem", "solution", "cta", "estimatedDuration", "viralScore", "scriptType"],
        },
      },
    });

    const cleanedText = cleanJsonString(response.text || "{}");
    const script = JSON.parse(cleanedText);

    const newBalance = deductCredits(userId, COSTS.SCRIPT);
    res.json({ script, newBalance });
  } catch (error: any) {
    console.error("Error generating script:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-thumbnails', requireAuth, async (req: any, res) => {
  const { topic, niche } = req.body;
  const userId = req.user.id;

  try {
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    if (user.balance < COSTS.THUMBNAILS) return res.status(403).json({ error: 'Solde insuffisant' });

    const ai = getAi();
    const response = await ai.models.generateContent({
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

    const cleanedText = cleanJsonString(response.text || "[]");
    const thumbnails = JSON.parse(cleanedText);

    const newBalance = deductCredits(userId, COSTS.THUMBNAILS);
    res.json({ thumbnails, newBalance });
  } catch (error: any) {
    console.error("Error generating thumbnails:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-hashtags', requireAuth, async (req: any, res) => {
  const { topic, niche } = req.body;
  const userId = req.user.id;

  try {
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    if (user.balance < COSTS.HASHTAGS) return res.status(403).json({ error: 'Solde insuffisant' });

    const ai = getAi();
    const response = await ai.models.generateContent({
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

    const cleanedText = cleanJsonString(response.text || "{}");
    const hashtags = JSON.parse(cleanedText);

    const newBalance = deductCredits(userId, COSTS.HASHTAGS);
    res.json({ hashtags, newBalance });
  } catch (error: any) {
    console.error("Error generating hashtags:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper to calculate video cost
const calculateVideoCost = (duration: string, resolution: string, promptLength: number, music: string) => {
  let baseCost = 10;
  if (duration === '30s') baseCost *= 2;
  if (duration === '60s') baseCost *= 4;
  if (resolution === '1080p') baseCost *= 2;
  if (resolution === '4k') baseCost *= 4;
  if (promptLength > 150) baseCost *= 1.5;
  else if (promptLength > 50) baseCost *= 1.2;
  if (music === 'AI Generated') baseCost += 5;
  else if (music !== 'No Music') baseCost += 2;
  return Math.round(baseCost);
};

// Video generation is more complex due to polling
router.post('/generate-video', requireAuth, async (req: any, res) => {
  const { prompt, duration, aspectRatio, resolution, music } = req.body;
  const userId = req.user.id;
  const cost = calculateVideoCost(duration, resolution, prompt.length, music);

  try {
    // Deduct credits BEFORE generation
    deductCredits(userId, cost);

    const ai = getAi();
    const enhancedPrompt = `${prompt}. Style/Mood: ${music}. Target Duration: ${duration}.`;

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: enhancedPrompt,
      config: {
        numberOfVideos: 1,
        resolution: resolution as any,
        aspectRatio: aspectRatio as any
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed");

    const videoResponse = await fetch(downloadLink, {
      method: 'GET',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! },
    });

    if (!videoResponse.ok) throw new Error("Failed to fetch video from Google");

    const arrayBuffer = await videoResponse.arrayBuffer();
    const base64Video = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:video/mp4;base64,${base64Video}`;

    // Get updated balance
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    res.json({ videoUrl: dataUrl, newBalance: user.balance });

  } catch (error: any) {
    console.error("Error generating video:", error);
    
    // Refund if it was a generation error (not insufficient funds)
    if (error.message !== 'Solde insuffisant. Veuillez recharger vos crédits.') {
       db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(cost, userId);
    }
    
    res.status(500).json({ error: error.message });
  }
});

export default router;
