import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lightbulb, FileText, Zap, ArrowRight, Lock, Video, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Activity, TrendingUp, CreditCard, Wallet, Smartphone, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawalMethod, setWithdrawalMethod] = useState('visa');
  const [amount, setAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Reset account info when method changes
    setAccountInfo('');
  }, [withdrawalMethod]);

  useEffect(() => {
    // Check if already unlocked in this session
    const unlocked = sessionStorage.getItem('zspace_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

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
      })
      .finally(() => setLoading(false));
  };

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passcode === 'z2008') {
      setIsUnlocked(true);
      sessionStorage.setItem('zspace_unlocked', 'true');
      fetchStats();
    } else {
      setAuthError('Code incorrect (Indice: z2008)');
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Z Space Verrouillé</h2>
          <p className="text-gray-400 mb-6">Veuillez entrer le code d'accès sécurisé.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setAuthError('');
              }}
              className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white text-center tracking-widest text-lg"
              placeholder="Code d'accès"
              autoFocus
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
            >
              Déverrouiller
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-white flex items-center justify-center h-full">Chargement du Z Space...</div>;

  const getAccountInfoLabel = () => {
    switch (withdrawalMethod) {
      case 'binance':
      case 'mywallet':
        return 'Adresse du Wallet';
      case 'airtel':
      case 'moov':
        return 'Numéro de téléphone';
      case 'paypal':
        return 'Email PayPal';
      case 'visa':
        return 'Numéro de carte';
      default:
        return 'Informations de compte';
    }
  };

  const getAccountInfoPlaceholder = () => {
    switch (withdrawalMethod) {
      case 'binance':
      case 'mywallet':
        return '0x... ou ID de compte';
      case 'airtel':
      case 'moov':
        return '+242 ... ou +241 ...';
      case 'paypal':
        return 'votre@email.com';
      case 'visa':
        return '4000 0000 0000 0000';
      default:
        return 'Entrez vos informations';
    }
  };

  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Z SPACE
          </h1>
          <p className="text-gray-400">Centre de commande & Revenus</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <button 
            onClick={() => {
              sessionStorage.removeItem('zspace_unlocked');
              setIsUnlocked(false);
            }}
            className="text-xs text-gray-500 hover:text-white flex items-center gap-1 mb-2"
          >
            <Lock className="w-3 h-3" /> Verrouiller la session
          </button>
          <div className="text-sm text-gray-500">Solde Disponible</div>
          <div className="text-3xl font-bold text-white">{user?.balance.toFixed(2)} €</div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-zinc-800 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.totalUsers}</div>
          <div className="text-xs text-gray-500">Utilisateurs Inscrits</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-zinc-800 text-green-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.activeUsers}</div>
          <div className="text-xs text-gray-500">Utilisateurs Actifs</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-zinc-800 text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.premiumUsers}</div>
          <div className="text-xs text-gray-500">Abonnés Premium</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-zinc-800 text-yellow-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.totalGenerations}</div>
          <div className="text-xs text-gray-500">Contenus Générés</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold mb-6">Revenus Mensuels (Publicité + Abonnements)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            Retirer mes gains
          </h3>
          
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Méthode de retrait</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'visa', label: 'Visa / MC', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: Globe },
                  { id: 'binance', label: 'Binance', icon: Wallet },
                  { id: 'airtel', label: 'Airtel Money', icon: Smartphone },
                  { id: 'moov', label: 'Moov Money', icon: Smartphone },
                  { id: 'mywallet', label: 'MyWallet', icon: Wallet },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setWithdrawalMethod(method.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                      withdrawalMethod === method.id 
                        ? 'bg-purple-600/20 border-purple-500 text-white' 
                        : 'bg-black border-zinc-800 text-gray-400 hover:bg-zinc-800'
                    }`}
                  >
                    <method.icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{getAccountInfoLabel()}</label>
              <input
                type="text"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                placeholder={getAccountInfoPlaceholder()}
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Montant (€)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="10"
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white font-mono text-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Confirmer le retrait
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              Traitement sous 24-48h ouvrées.
            </p>
          </form>
        </div>
      </div>

      {/* Quick Tools Section for Admin */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6 text-white">Outils de Création</h2>
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
                  <h3 className="font-bold text-lg text-white">{tool.title}</h3>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
