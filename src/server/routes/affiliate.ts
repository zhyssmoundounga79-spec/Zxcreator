import { Router } from 'express';
import { db } from '../../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

// Middleware to authenticate user
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Submit a video for review
router.post('/submit', authenticate, (req: any, res: any) => {
  const { platform, videoUrl } = req.body;
  const userId = req.user.id;

  try {
    // 1. Verify user has a paid plan (Ambassador requirement)
    const user: any = db.prepare('SELECT plan FROM users WHERE id = ?').get(userId);
    if (!user || user.plan === 'free') {
      return res.status(403).json({ error: 'Upgrade required. Only paid members can join the Ambassador program.' });
    }

    // 2. Validate Inputs
    if (!platform || !videoUrl) {
      return res.status(400).json({ error: 'Platform and Video URL are required' });
    }

    const allowedPlatforms = ['TikTok', 'Instagram', 'YouTube'];
    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform. Must be TikTok, Instagram, or YouTube.' });
    }

    try {
      new URL(videoUrl);
    } catch (_) {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }

    // 3. Rate Limiting: Check last submission time (prevent spam)
    const lastSubmission: any = db.prepare('SELECT created_at FROM affiliate_submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
    
    if (lastSubmission) {
      const lastTime = new Date(lastSubmission.created_at).getTime();
      const now = Date.now();
      const diffMinutes = (now - lastTime) / (1000 * 60);
      
      if (diffMinutes < 5) {
        return res.status(429).json({ error: 'Please wait 5 minutes before submitting another video.' });
      }
    }

    // 4. Check if video URL already exists to prevent duplicate submissions
    const existing = db.prepare('SELECT * FROM affiliate_submissions WHERE video_url = ?').get(videoUrl);
    if (existing) {
      return res.status(400).json({ error: 'This video has already been submitted.' });
    }

    // 5. Insert Submission
    const result = db.prepare(`
      INSERT INTO affiliate_submissions (user_id, platform, video_url)
      VALUES (?, ?, ?)
    `).run(userId, platform, videoUrl);

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get affiliate stats and submissions
router.get('/stats', authenticate, (req: any, res: any) => {
  const userId = req.user.id;

  try {
    const user: any = db.prepare('SELECT affiliate_earnings FROM users WHERE id = ?').get(userId);
    const submissions = db.prepare('SELECT * FROM affiliate_submissions WHERE user_id = ? ORDER BY created_at DESC').all(userId);

    // Calculate total views from approved submissions (mock logic for now, as views are updated manually/externally)
    const totalViews = submissions.reduce((acc: number, sub: any) => acc + (sub.views_count || 0), 0);

    res.json({
      earnings: user.affiliate_earnings || 0,
      totalViews,
      submissions
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
