import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OnboardingModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('has-seen-onboarding');
    if (user && !hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, [user]);

  const handleComplete = () => {
    localStorage.setItem('has-seen-onboarding', 'true');
    setIsVisible(false);
  };

  const steps = [
    {
      title: "Bienvenue sur Zxcreator ! 👋",
      description: "Votre suite tout-en-un pour dominer la création de contenu. Prenons une minute pour faire le tour.",
      icon: Sparkles
    },
    {
      title: "Générez des idées virales 💡",
      description: "Utilisez notre IA pour trouver des concepts de vidéos qui cartonnent dans votre niche.",
      icon: Sparkles
    },
    {
      title: "Créez des vidéos complètes 🎬",
      description: "De l'écriture du script à la génération vidéo avec Veo, tout est automatisé.",
      icon: Sparkles
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
            
            <button 
              onClick={handleComplete}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mt-4 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                {steps[step].title}
              </h2>
              <p className="text-gray-400 mb-8">
                {steps[step].description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === step ? 'bg-purple-500' : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (step < steps.length - 1) {
                      setStep(step + 1);
                    } else {
                      handleComplete();
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  {step < steps.length - 1 ? 'Suivant' : 'C\'est parti !'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
