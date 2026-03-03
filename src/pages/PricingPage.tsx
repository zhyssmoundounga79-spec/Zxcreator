import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
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
            <Link to="/login" className="text-white hover:text-purple-400 transition-colors">Connexion</Link>
            <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm font-bold">
              Commencer
            </Link>
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
              
              <Link to="/register" className="block w-full py-4 text-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold">
                Commencer Gratuitement
              </Link>
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
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Pas de publicité</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Analyse avancée</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Support prioritaire</li>
              </ul>
              
              <Link to="/register" className="block w-full py-4 text-center rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors font-bold shadow-lg shadow-purple-600/25">
                Devenir Pro
              </Link>
            </div>

            {/* Elite Plan */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Elite</h3>
              <div className="text-4xl font-bold mb-6">29,99€<span className="text-sm font-normal text-gray-400">/mois</span></div>
              <p className="text-gray-400 text-sm mb-8">Pour les professionnels qui visent le top 1%.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Tout du plan Pro</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> <strong>Algorithme prédictif</strong></li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Accès anticipé tendances</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Coaching IA personnalisé</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Templates premium</li>
              </ul>
              
              <Link to="/register" className="block w-full py-4 text-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold">
                Passer Elite
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
