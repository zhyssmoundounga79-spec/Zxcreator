import { Router } from 'express';
import { db } from '../../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

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
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// User: Request Payout
router.post('/request', requireAuth, (req: any, res) => {
  const { amount, method, details } = req.body;
  const userId = req.user.id;

  if (!amount || amount < 20) {
    return res.status(400).json({ error: 'Le montant minimum est de 20€.' });
  }

  try {
    const user: any = db.prepare('SELECT affiliate_earnings FROM users WHERE id = ?').get(userId);
    if (!user || user.affiliate_earnings < amount) {
      return res.status(400).json({ error: 'Solde insuffisant.' });
    }

    // Deduct from balance immediately to lock funds
    const newBalance = user.affiliate_earnings - amount;
    
    // Transaction
    const insert = db.transaction(() => {
      db.prepare('UPDATE users SET affiliate_earnings = ? WHERE id = ?').run(newBalance, userId);
      db.prepare('INSERT INTO payout_requests (user_id, amount, method, details) VALUES (?, ?, ?, ?)').run(userId, amount, method, details);
    });
    insert();

    res.json({ success: true, newBalance });
  } catch (error) {
    console.error('Payout request error:', error);
    res.status(500).json({ error: 'Erreur lors de la demande.' });
  }
});

// User: Get My Requests
router.get('/history', requireAuth, (req: any, res) => {
  const userId = req.user.id;
  try {
    const requests = db.prepare('SELECT * FROM payout_requests WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Admin: List All Requests
router.get('/list', requireAdmin, (req: any, res) => {
  try {
    const requests = db.prepare(`
      SELECT pr.*, u.email, u.name 
      FROM payout_requests pr 
      JOIN users u ON pr.user_id = u.id 
      ORDER BY pr.created_at DESC
    `).all();
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Admin: Approve
router.post('/approve', requireAdmin, (req: any, res) => {
  const { id } = req.body;
  try {
    db.prepare("UPDATE payout_requests SET status = 'approved', processed_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Admin: Reject
router.post('/reject', requireAdmin, (req: any, res) => {
  const { id } = req.body;
  try {
    const request: any = db.prepare('SELECT * FROM payout_requests WHERE id = ?').get(id);
    if (!request) return res.status(404).json({ error: 'Demande introuvable.' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Déjà traitée.' });

    // Refund user
    const refund = db.transaction(() => {
      db.prepare("UPDATE payout_requests SET status = 'rejected', processed_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
      db.prepare("UPDATE users SET affiliate_earnings = affiliate_earnings + ? WHERE id = ?").run(request.amount, request.user_id);
    });
    refund();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

export default router;
