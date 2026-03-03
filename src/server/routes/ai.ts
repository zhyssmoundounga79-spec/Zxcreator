import { Router } from 'express';
import { db } from '../../db';

const router = Router();

// Middleware to check auth
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

// API Routes
router.get('/history', requireAuth, async (req, res) => {
  // Mock history for now
  res.json({ history: [] });
});

export default router;
