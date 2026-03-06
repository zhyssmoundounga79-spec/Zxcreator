import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

router.post('/register', (req, res) => {
  const { email, password, name, tiktokHandle, referralCode } = req.body;
  
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

    let referredBy = null;
    if (referralCode) {
      const referrer: any = db.prepare('SELECT * FROM users WHERE referral_code = ?').get(referralCode);
      if (referrer) {
        referredBy = referrer.id;
        // Reward logic moved to payment success (see payment.ts)
      }
    }

    const newReferralCode = crypto.randomBytes(4).toString('hex');
    const hashedPassword = bcrypt.hashSync(password, 10);
    const role = email === 'zhyssmoundounga6@gmail.com' ? 'admin' : 'user';
    
    const result = db.prepare(`
      INSERT INTO users (email, password, name, tiktok_handle, role, referral_code, referred_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(email, hashedPassword, name, tiktokHandle || null, role, newReferralCode, referredBy);

    const token = jwt.sign({ id: result.lastInsertRowid, email, role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ user: { id: result.lastInsertRowid, email, name, role, plan: 'free', tiktokHandle, balance: 0.0, referralCode: newReferralCode, affiliateEarnings: 0.0 } });
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

    // Force admin role for specific email
    // REMOVED: Hardcoded admin access is insecure. Use database roles instead.
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan, balance: user.balance, affiliateEarnings: user.affiliate_earnings || 0 } });
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
    const user: any = db.prepare('SELECT id, email, name, role, plan, balance, referral_code as referralCode, last_daily_bonus as lastDailyBonus, affiliate_earnings as affiliateEarnings FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/daily-bonus', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastBonus = user.last_daily_bonus ? user.last_daily_bonus.split('T')[0] : null;

    if (lastBonus === today) {
      return res.status(400).json({ error: 'Bonus déjà réclamé aujourd\'hui' });
    }

    const bonusAmount = 10;
    const newBalance = (user.balance || 0) + bonusAmount;

    db.prepare('UPDATE users SET balance = ?, last_daily_bonus = ? WHERE id = ?')
      .run(newBalance, new Date().toISOString(), user.id);

    res.json({ success: true, balance: newBalance, lastDailyBonus: new Date().toISOString() });
  } catch (error) {
    console.error('Daily bonus error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
