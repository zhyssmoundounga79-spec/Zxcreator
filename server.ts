import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initDb } from './src/db';
import authRoutes from './src/server/routes/auth';
import aiRoutes from './src/server/routes/ai';
import adminRoutes from './src/server/routes/admin';
import paymentRoutes from './src/server/routes/payment';
import affiliateRoutes from './src/server/routes/affiliate';
import payoutRoutes from './src/server/routes/payout';
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- LOGO GENERATION START ---
async function generateLogo() {
  const logFile = 'logo_gen.log';
  fs.writeFileSync(logFile, 'Starting logo generation...\n');
  
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    fs.appendFileSync(logFile, 'Skipping logo generation: GEMINI_API_KEY not found\n');
    return;
  }
  
  const publicDir = path.join(process.cwd(), 'public');
  const logoPath = path.join(publicDir, 'logo.png');
  
  if (fs.existsSync(logoPath)) {
    fs.appendFileSync(logFile, 'Logo already exists at public/logo.png\n');
    return;
  }

  fs.appendFileSync(logFile, 'Generating logo...\n');
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A modern, minimalist, and professional logo for a tech brand named "Zxcreator". The logo should feature a stylized letter "Z" combined with a subtle lightning bolt or creative spark element. Use a gradient color scheme of electric purple and vibrant blue. The design should be clean, vector-style, and suitable for an app icon. White background.',
          },
        ],
      },
      // Remove imageConfig as it might not be supported or different for this model
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const buffer = Buffer.from(base64Data, 'base64');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.writeFileSync(logoPath, buffer);
        console.log('Logo generated and saved to public/logo.png');
        return;
      }
    }
    console.log('No image data found in response');
  } catch (error) {
    console.error('Error generating logo:', error);
    fs.writeFileSync('logo_error.log', `Error: ${error}\nStack: ${error instanceof Error ? error.stack : ''}`);
  }
}
// --- LOGO GENERATION END ---

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to capture raw body for Stripe webhooks
  app.use(express.json({
    verify: (req: any, res, buf) => {
      if (req.originalUrl.startsWith('/api/payment/webhook')) {
        req.rawBody = buf.toString();
      }
    }
  }));
  app.use(cookieParser());

  // Logo generation endpoint
  app.post('/api/admin/generate-logo', async (req, res) => {
    try {
      await generateLogo();
      res.json({ success: true, message: 'Logo generation triggered' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate logo', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Initialize Database
  initDb();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/affiliate', affiliateRoutes);
  app.use('/api/payout', payoutRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if strictly needed, though usually handled by build output)
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
