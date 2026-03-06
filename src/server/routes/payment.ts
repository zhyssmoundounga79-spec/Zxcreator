import { Router } from 'express';
import { db } from '../../db';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const router = Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia' as any,
}) : null;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

// Middleware to authenticate token
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const PLANS = {
  pro: { name: 'Pro Plan', price: 999, credits: 500 }, // in cents
  elite: { name: 'Elite Plan', price: 2999, credits: 2500 },
};

const PACKS = {
  discovery: { name: 'Pack Découverte', price: 500, credits: 100 },
  creator: { name: 'Pack Créateur', price: 2000, credits: 500 },
  studio: { name: 'Pack Studio', price: 5000, credits: 1500 },
};

router.post('/create-checkout-session', authenticateToken, async (req: any, res: any) => {
  const { plan, pack } = req.body;
  const userId = req.user.id;

  if (!stripe) {
    return res.status(503).json({ error: 'Stripe configuration missing. Please set STRIPE_SECRET_KEY.' });
  }

  try {
    let sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [],
      mode: 'payment',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing?payment=cancelled`,
      client_reference_id: userId.toString(),
      metadata: {},
    };

    if (plan && PLANS[plan as keyof typeof PLANS]) {
      const selectedPlan = PLANS[plan as keyof typeof PLANS];
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: selectedPlan.name,
            description: `Abonnement ${selectedPlan.name} - ${selectedPlan.credits} crédits/mois`,
          },
          unit_amount: selectedPlan.price,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      });
      sessionConfig.metadata.type = 'subscription';
      sessionConfig.metadata.plan = plan;
    } else if (pack && PACKS[pack as keyof typeof PACKS]) {
      const selectedPack = PACKS[pack as keyof typeof PACKS];
      sessionConfig.mode = 'payment';
      sessionConfig.line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: selectedPack.name,
            description: `${selectedPack.credits} Crédits`,
          },
          unit_amount: selectedPack.price,
        },
        quantity: 1,
      });
      sessionConfig.metadata.type = 'pack';
      sessionConfig.metadata.pack = pack;
      sessionConfig.metadata.credits = selectedPack.credits;
    } else {
      return res.status(400).json({ error: 'Invalid plan or pack' });
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !endpointSecret) {
    return res.status(503).send('Stripe not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const metadata = session.metadata;

    if (userId && metadata) {
      try {
        const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
          console.error(`User ${userId} not found for payment processing`);
          return res.status(200).send();
        }

        if (metadata.type === 'subscription') {
          const plan = metadata.plan;
          // Update user plan
          db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, userId);

          // Handle Referral Reward (Ambassador Program)
          if (user.referred_by) {
             const referrer: any = db.prepare('SELECT * FROM users WHERE id = ?').get(user.referred_by);
             if (referrer && referrer.plan !== 'free') {
                // 2€ to referrer
                db.prepare('UPDATE users SET affiliate_earnings = affiliate_earnings + 2 WHERE id = ?').run(referrer.id);
                // 2€ to system
                db.prepare('INSERT INTO system_earnings (amount, source, description) VALUES (?, ?, ?)').run(2, 'referral_split', `Referral split for user ${user.id} subscription`);
             }
          }

        } else if (metadata.type === 'pack') {
          const credits = parseInt(metadata.credits || '0');
          // Add credits to user balance (balance = credits)
          db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(credits, userId);
        }
      } catch (e) {
        console.error('Error processing webhook:', e);
      }
    }
  }

  res.json({ received: true });
});

export default router;
