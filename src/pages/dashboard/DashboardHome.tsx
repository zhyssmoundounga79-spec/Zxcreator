import { motion } from 'motion/react';
import { ArrowRight, Lightbulb, FileText, Zap, Video, Hash, Award } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../admin/AdminDashboard';
import DailyBonusWidget from '../../components/DailyBonusWidget';
import { useEffect } from 'react';

export default function DashboardHome() {
  const { user, reloadUser } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      reloadUser();
      // Ideally use a toast notification here
      // For now, we rely on the updated UI
    }
  }, [searchParams, reloadUser]);

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

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {/* Affiliate Program Highlight */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 relative overflow-hidden group cursor-pointer">
          <Link to="/dashboard/affiliate" className="absolute inset-0 z-10" />
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="w-24 h-24 text-yellow-400" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-20">
            <h3 className="font-bold text-yellow-200 flex items-center gap-2">
              <Award className="w-5 h-5" /> Programme Ambassadeur
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 animate-pulse">
              Nouveau
            </span>
          </div>
          <div className="text-3xl font-bold mb-1 text-white relative z-20">
            2€ <span className="text-sm font-normal text-gray-300">/ 1000 vues</span>
          </div>
          <p className="text-xs text-gray-400 mb-4 relative z-20">
            Faites la promotion de Zxcreator et gagnez de l'argent réel.
          </p>
          <div className="text-xs text-yellow-400 font-bold flex items-center gap-1 relative z-20 group-hover:translate-x-1 transition-transform">
            Commencer maintenant <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Solde Crédits</h3>
            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30">
              IA
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {Math.floor(user?.balance || 0)} <span className="text-sm font-normal text-gray-400">crédits</span>
          </div>
          <Link to="/pricing" className="text-xs text-green-400 hover:underline flex items-center gap-1">
            Recharger <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Gains Ambassadeur</h3>
            <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Cash
            </span>
          </div>
          <div className="text-3xl font-bold mb-1 text-yellow-400">
            {(user?.affiliateEarnings || 0).toFixed(2)} €
          </div>
          <Link to="/dashboard/affiliate" className="text-xs text-yellow-400 hover:underline flex items-center gap-1">
            Voir détails <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Plan Actuel</h3>
            <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              {user?.plan}
            </span>
          </div>
          <div className="text-3xl font-bold mb-1 capitalize">
            {user?.plan}
          </div>
          <Link to="/pricing" className="text-xs text-purple-400 hover:underline flex items-center gap-1">
            Mettre à niveau <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="h-full">
          <DailyBonusWidget />
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
