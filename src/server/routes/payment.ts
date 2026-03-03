import { Router } from 'express';

const router = Router();

router.post('/create-checkout-session', (req, res) => {
  const { plan } = req.body;
  
  // Mock response for now as we don't have real Stripe keys in env by default
  // In a real implementation, this would use stripe.checkout.sessions.create
  
  res.json({ 
    url: '#', 
    message: 'Stripe integration requires valid API keys. This is a demo endpoint.' 
  });
});

export default router;
