import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay slightly to not overwhelm user immediately
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-zinc-900/95 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl z-50"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-white">🍪 Cookies</h3>
            <button onClick={handleDecline} className="text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-white text-black font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Accepter
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-white/5 text-white font-medium py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              Refuser
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
