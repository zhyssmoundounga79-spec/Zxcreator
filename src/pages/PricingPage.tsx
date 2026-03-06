import { Check, Sparkles, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planOrPack: string, type: 'plan' | 'pack') => {
    if (!user) {
      navigate('/register');
      return;
    }

    setLoadingPlan(planOrPack);

    try {
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(type === 'plan' ? { plan: planOrPack } : { pack: planOrPack }),
      });

      if (response.status === 503) {
        alert("Le système de paiement n'est pas configuré (Mode Démo). Veuillez contacter l'administrateur pour activer les paiements.");
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Une erreur est survenue');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Zxcreator</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm font-bold">
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-purple-400 transition-colors">Connexion</Link>
                <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm font-bold">
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Investissez dans votre viralité</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos ambitions. Changez ou annulez à tout moment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Gratuit</h3>
              <div className="text-4xl font-bold mb-6">0€<span className="text-sm font-normal text-gray-400">/mois</span></div>
              <p className="text-gray-400 text-sm mb-8">Pour découvrir la puissance de l'IA.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> 5 idées par jour</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> 3 scripts par semaine</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Publicités intégrées</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Support communautaire</li>
              </ul>
              
              {user ? (
                <button disabled className="block w-full py-4 text-center rounded-xl bg-zinc-800 text-gray-500 font-bold cursor-not-allowed">
                  Plan Actuel
                </button>
              ) : (
                <Link to="/register" className="block w-full py-4 text-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold">
                  Commencer Gratuitement
                </Link>
              )}
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-purple-500 relative transform md:-translate-y-4 flex flex-col shadow-2xl shadow-purple-900/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Populaire</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">9,99€<span className="text-sm font-normal text-gray-400">/mois</span></div>
              <p className="text-gray-400 text-sm mb-8">Pour les créateurs réguliers qui veulent croître.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> <strong>Idées illimitées</strong></li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> <strong>Scripts illimités</strong></li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> <strong>500 Crédits / mois</strong> <span className="text-xs text-gray-500">(~30 vidéos)</span></li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Pas de publicité</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Analyse avancée</li>
              </ul>
              
              <button 
                onClick={() => handleSubscribe('pro', 'plan')}
                disabled={loadingPlan === 'pro'}
                className="block w-full py-4 text-center rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors font-bold shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
              >
                {loadingPlan === 'pro' && <Loader className="w-4 h-4 animate-spin" />}
                {user?.plan === 'pro' ? 'Gérer mon abonnement' : 'Devenir Pro'}
              </button>
            </div>

            {/* Elite Plan */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Elite</h3>
              <div className="text-4xl font-bold mb-6">29,99€<span className="text-sm font-normal text-gray-400">/mois</span></div>
              <p className="text-gray-400 text-sm mb-8">Pour les professionnels qui visent le top 1%.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Tout du plan Pro</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> <strong>2500 Crédits / mois</strong> <span className="text-xs text-gray-500">(~150 vidéos)</span></li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> <strong>Algorithme prédictif</strong></li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Accès anticipé tendances</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Templates premium</li>
              </ul>
              
              <button 
                onClick={() => handleSubscribe('elite', 'plan')}
                disabled={loadingPlan === 'elite'}
                className="block w-full py-4 text-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold flex items-center justify-center gap-2"
              >
                {loadingPlan === 'elite' && <Loader className="w-4 h-4 animate-spin" />}
                {user?.plan === 'elite' ? 'Gérer mon abonnement' : 'Passer Elite'}
              </button>
            </div>
          </div>

          {/* Credit Packs Section */}
          <div className="mt-24 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Besoin de plus de crédits ?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="text-xl font-bold mb-2">Pack Découverte</div>
                <div className="text-3xl font-bold text-purple-400 mb-2">5€</div>
                <div className="text-gray-400 mb-4">100 Crédits</div>
                <button 
                  onClick={() => handleSubscribe('discovery', 'pack')}
                  disabled={loadingPlan === 'discovery'}
                  className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                  {loadingPlan === 'discovery' && <Loader className="w-4 h-4 animate-spin" />}
                  Acheter
                </button>
              </div>
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-purple-500/30 hover:border-purple-500 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAIRE</div>
                <div className="text-xl font-bold mb-2">Pack Créateur</div>
                <div className="text-3xl font-bold text-purple-400 mb-2">20€</div>
                <div className="text-gray-400 mb-4">500 Crédits <span className="text-green-400 text-xs ml-1">+10% offert</span></div>
                <button 
                  onClick={() => handleSubscribe('creator', 'pack')}
                  disabled={loadingPlan === 'creator'}
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                  {loadingPlan === 'creator' && <Loader className="w-4 h-4 animate-spin" />}
                  Acheter
                </button>
              </div>
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="text-xl font-bold mb-2">Pack Studio</div>
                <div className="text-3xl font-bold text-purple-400 mb-2">50€</div>
                <div className="text-gray-400 mb-4">1500 Crédits <span className="text-green-400 text-xs ml-1">+20% offert</span></div>
                <button 
                  onClick={() => handleSubscribe('studio', 'pack')}
                  disabled={loadingPlan === 'studio'}
                  className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                  {loadingPlan === 'studio' && <Loader className="w-4 h-4 animate-spin" />}
                  Acheter
                </button>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              1 Crédit ≈ 0.05€. Les crédits n'expirent jamais tant que votre compte est actif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
