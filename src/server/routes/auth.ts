import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

router.post('/register', (req, res) => {
  const { email, password, name, tiktokHandle } = req.body;
  
  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    if (tiktokHandle) {
      const existingHandle = db.prepare('SELECT * FROM users WHERE tiktok_handle = ?').get(tiktokHandle);
      if (existingHandle) {
        return res.status(400).json({ error: 'Ce compte TikTok est déjà associé à un autre utilisateur.' });
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (email, password, name, tiktok_handle)
      VALUES (?, ?, ?, ?)
    `).run(email, hashedPassword, name, tiktokHandle || null);

    const token = jwt.sign({ id: result.lastInsertRowid, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ user: { id: result.lastInsertRowid, email, name, role: 'user', plan: 'free', tiktokHandle, balance: 0.0 } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan, balance: user.balance } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user: any = db.prepare('SELECT id, email, name, role, plan, balance FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/increment-balance', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    db.prepare('UPDATE users SET balance = balance + 0.1 WHERE id = ?').run(decoded.id);
    const user: any = db.prepare('SELECT balance FROM users WHERE id = ?').get(decoded.id);
    res.json({ balance: user.balance });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
