import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap, TrendingUp, Check, Crown } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Zxcreator</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <Link to="/login" className="text-white hover:text-purple-400 transition-colors">Connexion</Link>
            <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Commencer
            </Link>
            <Link to="/login?role=admin" className="ml-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform">
              <Crown className="w-4 h-4 text-yellow-300" /> Z Space
            </Link>
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/login?role=admin" className="bg-zinc-800 text-purple-400 px-3 py-2 rounded-full hover:bg-zinc-700 transition-colors border border-purple-500/30 flex items-center gap-1 text-[10px] font-bold">
              <Crown className="w-3 h-3" /> Z Space
            </Link>
            <Link to="/register" className="bg-white text-black px-3 py-2 rounded-full text-xs font-bold">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6">
              L'IA pour les créateurs ambitieux
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              L'usine à créateurs viraux <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                alimentée par l'IA
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Générez des idées, scripts et hooks qui explosent les compteurs. 
              Devenez viral sur TikTok, Reels et Shorts sans perdre votre âme.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                Essayer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all">
                Voir les tarifs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Idées Virales",
                desc: "Ne manquez jamais d'inspiration. Notre IA analyse les tendances pour vous proposer 20 concepts gagnants par jour."
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-green-400" />,
                title: "Scripts Optimisés",
                desc: "Des structures Hook-Problème-Solution qui retiennent l'attention jusqu'à la dernière seconde."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-purple-400" />,
                title: "Hooks Puissants",
                desc: "Générez les 3 premières secondes qui font la différence entre un flop et un million de vues."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Investissez dans votre croissance</h2>
            <p className="text-gray-400">Des plans adaptés à chaque étape de votre carrière de créateur.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-xl font-bold mb-2">Gratuit</h3>
              <div className="text-3xl font-bold mb-6">0€<span className="text-sm font-normal text-gray-400">/mois</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> 5 idées par jour</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> 3 scripts par semaine</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Publicités intégrées</li>
              </ul>
              <Link to="/register" className="block w-full py-3 text-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
                Commencer
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-purple-500 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Populaire</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-6">9,99€<span className="text-sm font-normal text-gray-400">/mois</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Idées illimitées</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Scripts illimités</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Pas de publicité</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Analyse avancée</li>
              </ul>
              <Link to="/register" className="block w-full py-3 text-center rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-medium">
                Devenir Pro
              </Link>
            </div>

            {/* Elite Plan */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-xl font-bold mb-2">Elite</h3>
              <div className="text-3xl font-bold mb-6">29,99€<span className="text-sm font-normal text-gray-400">/mois</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Tout du plan Pro</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Algorithme prédictif</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Accès anticipé tendances</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Coaching IA</li>
              </ul>
              <Link to="/register" className="block w-full py-3 text-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
                Passer Elite
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Zxcreator. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
