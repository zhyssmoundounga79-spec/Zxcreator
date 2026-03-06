import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, CreditCard, ArrowUpRight, History, AlertCircle, Building, Globe, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function WalletPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const withdrawalMethods = [
    { id: 'paypal', name: 'PayPal', icon: Globe, fee: '2%', min: 50, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'stripe', name: 'Virement Bancaire', icon: Building, fee: '0%', min: 100, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'mobile', name: 'Mobile Money', icon: Smartphone, fee: '1.5%', min: 20, color: 'text-green-400', bg: 'bg-green-500/10' },
    { id: 'crypto', name: 'Crypto (USDT)', icon: Wallet, fee: '1%', min: 50, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  const transactions = [
    { id: 1, type: 'gain', amount: 25.00, date: '2026-03-03', desc: 'Ambassadeur - TikTok Video #123' },
    { id: 2, type: 'gain', amount: 10.00, date: '2026-03-02', desc: 'Ambassadeur - Instagram Reel #456' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Wallet className="text-green-400" /> Portefeuille
        </h1>
        <p className="text-gray-400">Gérez vos gains et effectuez des retraits.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet className="w-24 h-24 text-green-400" />
            </div>
            <h3 className="text-green-200 font-medium mb-2">Solde Disponible</h3>
            <div className="text-4xl font-bold text-white mb-4">
              {user?.affiliateEarnings?.toFixed(2) || '0.00'} €
            </div>
            <div className="flex items-center gap-2 text-xs text-green-300 bg-green-500/20 px-3 py-1.5 rounded-full w-fit">
              <ArrowUpRight className="w-3 h-3" />
              +2.4% cette semaine
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              Info Retrait
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Les retraits sont traités sous 24-48h ouvrées. Le seuil minimum dépend de la méthode choisie.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-1">
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`pb-3 px-2 text-sm font-bold transition-colors relative ${
                activeTab === 'withdraw' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Retirer des fonds
              {activeTab === 'withdraw' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-2 text-sm font-bold transition-colors relative ${
                activeTab === 'history' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Historique
              {activeTab === 'history' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
              )}
            </button>
          </div>

          {activeTab === 'withdraw' ? (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Choisir une méthode</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {withdrawalMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'bg-zinc-800 border-green-500 ring-1 ring-green-500'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${method.bg}`}>
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                    </div>
                    <h4 className="font-bold">{method.name}</h4>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Min: {method.min}€</span>
                      <span>Frais: {method.fee}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  <h4 className="font-bold mb-4">Détails du retrait</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Montant à retirer</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                        />
                        <span className="absolute right-4 top-3 text-gray-500">EUR</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        {selectedMethod === 'paypal' ? 'Email PayPal' : 
                         selectedMethod === 'crypto' ? 'Adresse USDT (TRC20)' : 
                         selectedMethod === 'mobile' ? 'Numéro de téléphone' : 'IBAN'}
                      </label>
                      <input
                        type="text"
                        placeholder="..."
                        className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <button className="w-full py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-500 transition-colors">
                      Confirmer la demande
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.desc}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-400">+{tx.amount.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
