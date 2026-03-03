import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  FileText, 
  Zap, 
  Image as ImageIcon, 
  Video,
  Hash,
  BarChart2, 
  Settings, 
  LogOut,
  ShieldAlert,
  Crown
} from 'lucide-react';
import { cn } from '../lib/utils';
import AdBanner from '../components/AdBanner';

export default function DashboardLayout({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user, logout, updateBalance } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetch('/api/auth/increment-balance', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.balance !== undefined) {
            updateBalance(data.balance);
          }
        })
        .catch(err => console.error('Failed to increment balance:', err));
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [user, updateBalance]);

  const navItems = [
    { 
      icon: user?.role === 'admin' ? Crown : LayoutDashboard, 
      label: user?.role === 'admin' ? 'Z Space' : 'Accueil', 
      path: user?.role === 'admin' ? '/admin' : '/dashboard',
      className: user?.role === 'admin' ? 'text-purple-400' : ''
    },
    { icon: Lightbulb, label: 'Idées Virales', path: '/dashboard/ideas' },
    { icon: FileText, label: 'Scripts', path: '/dashboard/scripts' },
    { icon: Zap, label: 'Hooks', path: '/dashboard/hooks' },
    { icon: ImageIcon, label: 'Miniatures', path: '/dashboard/thumbnails' },
    { icon: Video, label: 'Vidéos Veo', path: '/dashboard/video' },
    { icon: Hash, label: 'Hashtags', path: '/dashboard/hashtags' },
    { icon: BarChart2, label: 'Analyses', path: '/dashboard/analytics' },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950 z-20">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          Zxcreator
        </Link>
        <div className="flex items-center gap-3">
           {user?.role === 'admin' && !isAdmin && (
            <Link to="/admin">
              <Crown className="w-6 h-6 text-yellow-400" />
            </Link>
           )}
           <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
           </div>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 border-r border-white/10 flex-col h-full">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            Zxcreator
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-white/10 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/5",
                // @ts-ignore
                item.className
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          
          {isAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 mt-4"
            >
              <LayoutDashboard className="w-5 h-5" />
              Retour App
            </Link>
          )}

          {/* Ad Banner for Free Users */}
          {!isAdmin && user?.plan === 'free' && (
            <div className="mt-6">
              <AdBanner />
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.plan} Plan</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 relative pb-20 md:pb-0">
        {/* Top Right Admin Access (Z Space) - Desktop Only */}
        {user?.role === 'admin' && !isAdmin && (
          <div className="hidden md:block absolute top-4 right-4 z-50">
            <Link 
              to="/admin" 
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform border border-white/20"
            >
              <Crown className="w-5 h-5 text-yellow-300" />
              ACCÉDER AU Z SPACE
            </Link>
          </div>
        )}

        <div className="max-w-6xl mx-auto p-4 md:p-8 pt-6 md:pt-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 px-4 py-2 flex justify-between items-center z-50 pb-safe">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === item.path 
                ? "text-white" 
                : "text-gray-500 hover:text-gray-300",
               // @ts-ignore
               item.className
            )}
          >
            <item.icon className={cn("w-6 h-6", location.pathname === item.path && "fill-current")} />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
