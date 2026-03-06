import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  BrainCircuit, 
  ScrollText, 
  Magnet, 
  Palette, 
  Clapperboard,
  Tags,
  CreditCard,
  Activity, 
  Settings2, 
  LogOut,
  ShieldAlert,
  Crown,
  Trophy,
  LifeBuoy,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../lib/utils';
import DashboardSearch from '../components/DashboardSearch';

export default function DashboardLayout({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const userNavItems = [
    { icon: LayoutGrid, label: 'Accueil', path: '/dashboard' },
    { icon: BrainCircuit, label: 'Idées Virales', path: '/dashboard/ideas' },
    { icon: ScrollText, label: 'Scripts', path: '/dashboard/scripts' },
    { icon: Magnet, label: 'Hooks', path: '/dashboard/hooks' },
    { icon: Palette, label: 'Miniatures', path: '/dashboard/thumbnails' },
    { icon: Clapperboard, label: 'Vidéos Veo', path: '/dashboard/video' },
    { icon: Tags, label: 'Hashtags', path: '/dashboard/hashtags' },
    { icon: Trophy, label: 'Ambassadeur', path: '/dashboard/affiliate', className: 'text-yellow-400' },
    { icon: CreditCard, label: 'Portefeuille', path: '/dashboard/wallet' },
    { icon: Activity, label: 'Analyses', path: '/dashboard/analytics' },
    { icon: Settings2, label: 'Paramètres', path: '/dashboard/settings' },
    { icon: LifeBuoy, label: 'Aide & Support', path: '/dashboard/support' },
  ];

  const adminNavItems = [
    { icon: Crown, label: 'Z Space', path: '/admin', className: 'text-purple-400' },
    { icon: ShieldAlert, label: 'Sécurité', path: '/admin', className: 'text-gray-400 opacity-50 cursor-not-allowed' },
    { icon: Settings2, label: 'Système', path: '/admin', className: 'text-gray-400 opacity-50 cursor-not-allowed' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950 z-20">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/logo.svg" alt="Zxcreator Logo" className="w-8 h-8 rounded-lg" />
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
      <aside className={`hidden md:flex w-64 border-r ${isAdmin ? 'border-purple-900/30 bg-zinc-950' : 'border-white/10'} flex-col h-full`}>
        <div className={`p-6 border-b ${isAdmin ? 'border-purple-900/30' : 'border-white/10'}`}>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <img src="/logo.svg" alt="Zxcreator Logo" className="w-8 h-8 rounded-lg" />
            {isAdmin ? <span className="text-purple-400">Z SPACE</span> : 'Zxcreator'}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? (isAdmin ? "bg-purple-900/20 text-purple-400 border border-purple-500/20" : "bg-white/10 text-white")
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
        </nav>

        <div className={`p-4 border-t ${isAdmin ? 'border-purple-900/30' : 'border-white/10'}`}>
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
        {/* Header with Search */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <DashboardSearch />
          </div>
          
          {/* Top Right Admin Access (Z Space) - Desktop Only */}
          {user?.role === 'admin' && !isAdmin && (
            <div className="hidden md:block">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform border border-white/20 text-sm"
              >
                <Crown className="w-4 h-4 text-yellow-300" />
                Z SPACE
              </Link>
            </div>
          )}
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-8 pt-6 md:pt-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 px-4 py-2 flex justify-between items-center z-50 pb-safe">
        {navItems.slice(0, 5).map((item, i) => (
          <Link
            key={i}
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
