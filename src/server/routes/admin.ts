import { Router } from 'express';
import { db } from '../../db';

const router = Router();

router.get('/stats', (req, res) => {
  // In a real app, verify admin role here
  
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
