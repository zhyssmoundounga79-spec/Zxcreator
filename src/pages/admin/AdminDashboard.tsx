import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Clock, 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Globe,
  Server,
  Shield,
  AlertTriangle,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalMethod, setWithdrawalMethod] = useState('visa');
  const [amount, setAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [timeRevenue, setTimeRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'financial' | 'security' | 'settings'>('overview');

  // Mock Data for Admin
  const recentActivity = [
    { id: 1, user: 'alice@example.com', action: 'Abonnement Pro', time: 'Il y a 2 min', amount: '+9.99€' },
    { id: 2, user: 'bob@test.com', action: 'Connexion', time: 'Il y a 5 min', amount: '-' },
    { id: 3, user: 'charlie@domain.com', action: 'Abonnement Elite', time: 'Il y a 12 min', amount: '+29.99€' },
    { id: 4, user: 'david@mail.com', action: 'Connexion', time: 'Il y a 15 min', amount: '-' },
    { id: 5, user: 'eva@web.com', action: 'Retrait Affilié', time: 'Il y a 32 min', amount: '-25.00€' },
  ];

  const securityLogs = [
    { id: 1, event: 'Login Success', ip: '192.168.1.1', user: 'admin', time: '10:00 AM', status: 'success' },
    { id: 2, event: 'Failed Login', ip: '45.32.12.9', user: 'unknown', time: '09:45 AM', status: 'failed' },
    { id: 3, event: 'Password Change', ip: '192.168.1.1', user: 'admin', time: 'Yesterday', status: 'success' },
    { id: 4, event: 'API Key Access', ip: '10.0.0.5', user: 'system', time: 'Yesterday', status: 'info' },
  ];

  const userList = [
    { id: 1, name: 'Alice Martin', email: 'alice@example.com', plan: 'Pro', status: 'Active', joined: '2026-02-15' },
    { id: 2, name: 'Bob Dupont', email: 'bob@test.com', plan: 'Free', status: 'Active', joined: '2026-02-20' },
    { id: 3, name: 'Charlie Dre', email: 'charlie@domain.com', plan: 'Elite', status: 'Active', joined: '2026-03-01' },
    { id: 4, name: 'David Lou', email: 'david@mail.com', plan: 'Free', status: 'Banned', joined: '2026-01-10' },
    { id: 5, name: 'Eva Green', email: 'eva@web.com', plan: 'Pro', status: 'Active', joined: '2026-02-28' },
  ];

  useEffect(() => {
    setAccountInfo('');
  }, [withdrawalMethod]);

  useEffect(() => {
    const unlocked = sessionStorage.getItem('zspace_unlocked');
    if (unlocked === 'true' && user?.email.toLowerCase() === 'zhyssmoundounga6@gmail.com') {
      setIsUnlocked(true);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Time-based revenue generation (1€/s per active user)
  useEffect(() => {
    if (isUnlocked && stats?.activeUsers) {
      const interval = setInterval(() => {
        const revenuePerSecond = stats.activeUsers * 1;
        setTimeRevenue(prev => prev + revenuePerSecond);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isUnlocked, stats]);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/stats')
      .then(res => {
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => {
        console.error(err);
        setAuthError('Impossible de charger les statistiques');
      });

    fetch('/api/payout/list')
      .then(res => res.json())
      .then(data => setPayoutRequests(data.requests || []))
      .finally(() => setLoading(false));
  };

  const handleApprovePayout = async (id: number) => {
    if (!confirm('Confirmer le paiement ?')) return;
    try {
      await fetch('/api/payout/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchStats();
    } catch (e) {
      alert('Erreur');
    }
  };

  const handleRejectPayout = async (id: number) => {
    if (!confirm('Rejeter la demande ?')) return;
    try {
      await fetch('/api/payout/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchStats();
    } catch (e) {
      alert('Erreur');
    }
  };

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (user?.email.toLowerCase() !== 'zhyssmoundounga6@gmail.com') {
      setAuthError('Accès refusé : Email non autorisé.');
      return;
    }

    if (passcode === 'z2008') {
      setIsUnlocked(true);
      sessionStorage.setItem('zspace_unlocked', 'true');
      fetchStats();
    } else {
      setAuthError('Code d\'accès incorrect.');
    }
  };

  const handleWithdraw = (e: FormEvent) => {
    e.preventDefault();
    if (!accountInfo) {
      alert('Veuillez entrer vos informations de paiement.');
      return;
    }
    alert(`DEMANDE DE RETRAIT ENREGISTRÉE\n\nMontant: ${amount}€\nMéthode: ${withdrawalMethod.toUpperCase()}\nCompte/Numéro: ${accountInfo}\n\nTraitement en cours...`);
    setAmount('');
    setAccountInfo('');
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-black">
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-2xl shadow-purple-900/20">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700">
            <Lock className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-3xl font-black mb-2 text-white">Z SPACE</h2>
          <p className="text-gray-400 mb-8">Centre de Commandement Financier</p>
          
          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="text-left text-xs text-gray-500 bg-zinc-950 p-3 rounded border border-zinc-800">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="text-white font-mono">{user?.email}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Statut:</span>
                <span className="text-green-500 flex items-center gap-1"><Shield className="w-3 h-3" /> Sécurisé</span>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError('');
                }}
                className="w-full px-4 py-4 rounded-xl bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white text-center tracking-[0.5em] text-xl font-bold placeholder:tracking-normal"
                placeholder="CODE D'ACCÈS"
                autoFocus
              />
            </div>
            
            {authError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-medium flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {authError}
              </motion.div>
            )}
            
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              INITIALISER LE SYSTÈME
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-white flex items-center justify-center h-screen bg-black">Chargement du Z Space...</div>;

  const getAccountInfoLabel = () => {
    switch (withdrawalMethod) {
      case 'binance': return 'Adresse Wallet (USDT/BTC)';
      case 'airtel': case 'moov': return 'Numéro Mobile Money';
      case 'paypal': return 'Email PayPal';
      case 'visa': return 'Numéro de Carte';
      default: return 'Identifiant';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Top Bar */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 tracking-tight">
              Z SPACE
            </h1>
          </div>
          <p className="text-gray-400 font-mono text-sm">v2.4.0 • SYSTEM: ONLINE • ENCRYPTED</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-green-400 flex items-center justify-end gap-1 animate-pulse mb-1">
              <Clock className="w-3 h-3" /> REVENU ACTIF ({stats?.activeUsers || 0} users × 1€/s)
            </div>
            <div className="text-4xl font-mono font-bold text-white tabular-nums tracking-tight">
              {(user?.balance || 0 + timeRevenue).toFixed(2)} €
            </div>
          </div>
          
          <button 
            onClick={() => {
              sessionStorage.removeItem('zspace_unlocked');
              setIsUnlocked(false);
            }}
            className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-red-900/20 hover:border-red-500/50 hover:text-red-500 transition-all"
            title="Verrouiller la session"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-gray-500">TOTAL</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.totalUsers}</div>
          <div className="text-xs text-gray-500">Utilisateurs Inscrits</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-green-500">LIVE</span>
          </div>
          <div className="text-3xl font-bold mb-1 relative z-10">{stats?.activeUsers}</div>
          <div className="text-xs text-gray-500 relative z-10">Utilisateurs en ligne</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-gray-500">MRR</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.premiumUsers}</div>
          <div className="text-xs text-gray-500">Abonnements Actifs</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-gray-500">LOAD</span>
          </div>
          <div className="text-3xl font-bold mb-1">24%</div>
          <div className="text-xs text-gray-500">Charge Serveur</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Management & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-zinc-800">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'overview' ? 'text-white' : 'text-gray-500'}`}
            >
              Vue d'ensemble
              {activeTab === 'overview' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'users' ? 'text-white' : 'text-gray-500'}`}
            >
              Gestion Utilisateurs
              {activeTab === 'users' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('financial')}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'financial' ? 'text-white' : 'text-gray-500'}`}
            >
              Rapports Financiers
              {activeTab === 'financial' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'security' ? 'text-white' : 'text-gray-500'}`}
            >
              Sécurité
              {activeTab === 'security' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'settings' ? 'text-white' : 'text-gray-500'}`}
            >
              Paramètres
              {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
            </button>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Revenue Chart */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-bold mb-6">Flux de Trésorerie (30 jours)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-bold mb-4 flex items-center justify-between">
                  <span>Activité Récente</span>
                  <button className="text-xs text-purple-400 hover:text-purple-300">Voir tout</button>
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.amount.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{item.action}</p>
                          <p className="text-xs text-gray-500">{item.user} • {item.time}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-mono font-bold ${item.amount.startsWith('+') ? 'text-green-400' : 'text-gray-400'}`}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex justify-between mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Rechercher un utilisateur..." 
                    className="w-full bg-black border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700">
                  Exporter CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-gray-500">
                      <th className="pb-3 pl-2">Utilisateur</th>
                      <th className="pb-3">Plan</th>
                      <th className="pb-3">Statut</th>
                      <th className="pb-3">Inscrit le</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {userList.map((u) => (
                      <tr key={u.id} className="group hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3 pl-2">
                          <div className="font-medium text-white">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            u.plan === 'Elite' ? 'bg-yellow-500/20 text-yellow-400' :
                            u.plan === 'Pro' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-zinc-700 text-gray-400'
                          }`}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`flex items-center gap-1.5 text-xs ${u.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>
                            {u.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{u.joined}</td>
                        <td className="py-3 text-right">
                          <button className="p-2 hover:bg-zinc-700 rounded text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Journal de Sécurité
              </h3>
              <div className="space-y-4">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : log.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <div>
                        <p className="font-medium text-white">{log.event}</p>
                        <p className="text-xs text-gray-500">IP: {log.ip} • User: {log.user}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                Paramètres Système
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-zinc-800">
                  <div>
                    <p className="font-medium text-white">Mode Maintenance</p>
                    <p className="text-xs text-gray-500">Désactiver l'accès utilisateur temporairement</p>
                  </div>
                  <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full transition-all"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-zinc-800">
                  <div>
                    <p className="font-medium text-white">Inscriptions</p>
                    <p className="text-xs text-gray-500">Autoriser les nouveaux utilisateurs</p>
                  </div>
                  <div className="w-12 h-6 bg-green-900 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-green-500 rounded-full transition-all"></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/30">
                  <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Zone de Danger
                  </h4>
                  <p className="text-xs text-gray-400 mb-4">Actions irréversibles pour l'administration système.</p>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors">
                    PURGER LE CACHE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Withdrawal & System */}
        <div className="space-y-8">
          {/* Payout Requests Management */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <h3 className="font-bold mb-6 flex items-center gap-2 relative z-10">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Demandes de Retrait ({payoutRequests.filter(r => r.status === 'pending').length})
            </h3>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {payoutRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune demande.</p>
              ) : (
                payoutRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-lg bg-black/50 border border-zinc-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-white">{req.amount.toFixed(2)} €</div>
                        <div className="text-xs text-gray-400">{req.email}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        req.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {req.status}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-gray-500 mb-3 bg-zinc-900 p-2 rounded">
                      {req.method.toUpperCase()}: {req.details}
                    </div>
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprovePayout(req.id)}
                          className="flex-1 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded"
                        >
                          Payer
                        </button>
                        <button 
                          onClick={() => handleRejectPayout(req.id)}
                          className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded"
                        >
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              État du Système
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>API Latency</span>
                  <span className="text-green-400">45ms</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[20%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Database Load</span>
                  <span className="text-yellow-400">62%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[62%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Storage (Veo)</span>
                  <span className="text-blue-400">1.2TB / 5TB</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[24%]"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs text-gray-500">Dernière sauvegarde: 11:00 AM</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase border border-green-500/20">Opérationnel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
