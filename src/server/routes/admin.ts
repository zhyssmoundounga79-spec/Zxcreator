import { Router } from 'express';
import { db } from '../../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

// Middleware to authenticate and check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/stats', requireAdmin, (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const generationsCount = db.prepare('SELECT COUNT(*) as count FROM generations').get() as any;
    const premiumUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE plan != 'free'").get() as any;
    
    // Mock revenue data for the chart
    const revenueData = [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 1500 },
      { name: 'Jun', value: 2000 },
    ];

    res.json({
      totalUsers: userCount.count,
      activeUsers: Math.floor(userCount.count * 0.6), // Mock active
      totalGenerations: generationsCount.count,
      premiumUsers: premiumUsers.count,
      revenueData
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
