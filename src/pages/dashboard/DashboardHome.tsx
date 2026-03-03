import { motion } from 'motion/react';
import { ArrowRight, Lightbulb, FileText, Zap, Video, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../admin/AdminDashboard';

export default function DashboardHome() {
  const { user } = useAuth();

  // If user is admin, show Z Space (Admin Dashboard) immediately
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.name} 👋</h1>
        <p className="text-gray-400">Prêt à créer votre prochain contenu viral ?</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Crédits restants</h3>
            <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {user?.plan === 'free' ? '5/jour' : 'Illimité'}
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {user?.plan === 'free' ? '5' : '∞'}
          </div>
          <p className="text-xs text-gray-500">Idées générées aujourd'hui</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Gains Cumulés</h3>
            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30">
              Actif
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {user?.balance.toFixed(2)} €
          </div>
          <p className="text-xs text-gray-500">0.10€ gagnés toutes les 10s</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Score Viral</h3>
            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Stable
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">84</div>
          <p className="text-xs text-gray-500">Basé sur vos dernières créations</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Passer Pro</h3>
            <span className="text-xs px-2 py-1 rounded bg-white/20 text-white">
              Recommandé
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-4">Débloquez l'IA illimitée et les analyses avancées.</p>
          <Link to="/pricing" className="block w-full py-2 text-center rounded bg-white text-black text-sm font-bold hover:bg-gray-200">
            Voir les offres
          </Link>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Outils Rapides</h2>
      <div className="grid md:grid-cols-5 gap-6">
        {[
          { icon: Lightbulb, title: 'Idées', path: '/dashboard/ideas', color: 'text-yellow-400' },
          { icon: FileText, title: 'Scripts', path: '/dashboard/scripts', color: 'text-blue-400' },
          { icon: Zap, title: 'Hooks', path: '/dashboard/hooks', color: 'text-purple-400' },
          { icon: Video, title: 'Vidéos', path: '/dashboard/video', color: 'text-red-400' },
          { icon: Hash, title: 'Hashtags', path: '/dashboard/hashtags', color: 'text-pink-400' },
        ].map((tool, i) => (
          <Link to={tool.path} key={i}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{tool.title}</h3>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
