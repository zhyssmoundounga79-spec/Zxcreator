import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Video, CheckCircle, Clock, AlertCircle, Link as LinkIcon, Eye, Award, Lock, Copy, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AffiliateProgram() {
  const { user } = useAuth();
  const [videoLink, setVideoLink] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('paypal');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);

  // Gate access for free users
  if (user?.plan === 'free') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500" />
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Programme Ambassadeur Réservé</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Le programme Ambassadeur est exclusif aux membres Premium. 
            Débloquez votre lien de parrainage et gagnez des crédits pour chaque ami invité, 
            ainsi que des rémunérations pour vos vues.
          </p>
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Award className="w-5 h-5" />
            Devenir Ambassadeur (Upgrade)
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/affiliate/stats');
      const data = await res.json();
      if (res.ok) {
        setSubmissions(data.submissions);
        setEarnings(data.earnings);
        setTotalViews(data.totalViews);
      }
      
      const payoutRes = await fetch('/api/payout/history');
      const payoutData = await payoutRes.json();
      if (payoutRes.ok) {
        setPayoutHistory(payoutData.requests);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (parseFloat(payoutAmount) < 20) {
      alert('Le montant minimum est de 20€');
      return;
    }
    if (parseFloat(payoutAmount) > earnings) {
      alert('Solde insuffisant');
      return;
    }

    try {
      const res = await fetch('/api/payout/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(payoutAmount), method: payoutMethod, details: payoutDetails }),
      });

      if (res.ok) {
        alert('Demande de retrait envoyée avec succès !');
        setPayoutModalOpen(false);
        setPayoutAmount('');
        setPayoutDetails('');
        fetchStats();
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la demande');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/affiliate/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, videoUrl: videoLink }),
      });

      if (res.ok) {
        setSubmitted(true);
        setVideoLink('');
        fetchStats(); // Refresh list
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la soumission');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Erreur réseau');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Award className="text-yellow-400" /> Programme Ambassadeur Zxcreator
        </h1>
        <p className="text-gray-400">Invitez des amis et gagnez des crédits. Faites la promotion et gagnez du cash.</p>
      </header>

      {/* Referral Section */}
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-yellow-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Users className="w-64 h-64 text-yellow-500" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Votre Code de Parrainage</h2>
            <p className="text-gray-400 mb-6">
              Partagez ce code avec vos amis. Ils l'entrent lors de l'inscription.
              <br />
              <span className="text-yellow-400 font-medium">Vous gagnez 50 crédits</span> pour chaque nouvel inscrit !
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-black/50 border border-zinc-700 rounded-lg px-6 py-3 font-mono text-xl text-yellow-400 tracking-wider">
                {user?.referralCode || 'LOADING...'}
              </div>
              <button 
                onClick={copyReferralCode}
                className="p-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors text-white"
                title="Copier le code"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-6 border border-white/5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" /> Vos Stats Parrainage
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-900/50">
                <div className="text-gray-400 text-xs mb-1">Amis invités</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900/50">
                <div className="text-gray-400 text-xs mb-1">Crédits gagnés</div>
                <div className="text-2xl font-bold text-yellow-400">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Submission & Rules */}
        <div className="md:col-span-1 space-y-6">
          {/* Earnings Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-24 h-24 text-yellow-400" />
            </div>
            <h3 className="text-yellow-200 font-medium mb-2">Gains Ambassadeur</h3>
            <div className="text-4xl font-bold text-white mb-4">
              {earnings.toFixed(2)} €
            </div>
            <div className="flex items-center gap-2 text-xs text-yellow-300 bg-yellow-500/20 px-3 py-1.5 rounded-full w-fit mb-4">
              <TrendingUp className="w-3 h-3" />
              {totalViews.toLocaleString()} vues validées
            </div>
            
            <button 
              onClick={() => setPayoutModalOpen(true)}
              disabled={earnings < 20}
              className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
            >
              {earnings < 20 ? `Encore ${(20 - earnings).toFixed(2)}€ pour retirer` : 'Demander un paiement'}
            </button>
          </div>

          {/* Payout Modal */}
          {payoutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full relative">
                <button 
                  onClick={() => setPayoutModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                  <AlertCircle className="w-5 h-5 rotate-45" />
                </button>
                
                <h3 className="text-xl font-bold text-white mb-4">Demande de Retrait</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Vous pouvez retirer jusqu'à <span className="text-yellow-400 font-bold">{earnings.toFixed(2)}€</span>.
                  Le traitement prend 24-48h.
                </p>

                <form onSubmit={handlePayoutRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Montant (€)</label>
                    <input
                      type="number"
                      min="20"
                      max={earnings}
                      step="0.01"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-yellow-500 focus:outline-none text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Méthode</label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-yellow-500 focus:outline-none text-white"
                    >
                      <option value="paypal">PayPal</option>
                      <option value="bank">Virement Bancaire (SEPA)</option>
                      <option value="crypto">Crypto (USDT - TRC20)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {payoutMethod === 'paypal' ? 'Email PayPal' : payoutMethod === 'bank' ? 'IBAN' : 'Adresse Wallet'}
                    </label>
                    <input
                      type="text"
                      value={payoutDetails}
                      onChange={(e) => setPayoutDetails(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-yellow-500 focus:outline-none text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors"
                  >
                    Confirmer la demande
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submission Form */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" /> Soumettre une vidéo
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Lien de la vidéo</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://tiktok.com/..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-yellow-500 focus:outline-none text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Plateforme</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-yellow-500 focus:outline-none text-white"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
              >
                {submitted ? <CheckCircle className="w-5 h-5" /> : 'Soumettre pour validation'}
              </button>
              {submitted && (
                <p className="text-green-400 text-xs text-center mt-2">Vidéo soumise avec succès !</p>
              )}
            </form>
          </div>

          {/* Rules */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/30 shadow-lg shadow-yellow-900/10">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-white">
              <AlertCircle className="w-6 h-6 text-yellow-500" /> Règles & Rémunération
            </h3>
            
            <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-sm text-yellow-200 mb-1 font-medium uppercase tracking-wider">Rémunération</div>
              <div className="text-3xl font-bold text-yellow-400 flex items-baseline gap-2">
                2.00 € <span className="text-sm text-yellow-200/70 font-normal">/ 1000 vues</span>
              </div>
              <p className="text-xs text-yellow-200/60 mt-2">
                Paiement via PayPal ou Virement dès 20€ cumulés.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-zinc-700 text-xs font-bold text-white">1</div>
                <p className="text-sm text-gray-300">
                  <span className="text-white font-medium">Promotion Explicite :</span> La vidéo doit clairement montrer et parler de Zxcreator.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-zinc-700 text-xs font-bold text-white">2</div>
                <p className="text-sm text-gray-300">
                  <span className="text-white font-medium">Lien Obligatoire :</span> Votre lien affilié doit être visible en bio ou description.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-zinc-700 text-xs font-bold text-white">3</div>
                <p className="text-sm text-gray-300">
                  <span className="text-white font-medium">Qualité des Vues :</span> Les bots et vues achetées entraînent un <span className="text-red-400">bannissement immédiat</span>.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-zinc-700 text-xs font-bold text-white">4</div>
                <p className="text-sm text-gray-300">
                  <span className="text-white font-medium">Validation :</span> Les gains sont validés sous 24h-48h après vérification.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Dashboard & Stats */}
        <div className="md:col-span-2 space-y-6">
          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Video, title: "Créez", desc: "Faites une vidéo virale sur Zxcreator" },
              { icon: LinkIcon, title: "Postez", desc: "Publiez avec votre lien affilié" },
              { icon: DollarSign, title: "Gagnez", desc: "Recevez 2€ / 1000 vues" },
            ].map((step, i) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <div className="w-10 h-10 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5 text-gray-300" />
                </div>
                <h4 className="font-bold text-white mb-1">{step.title}</h4>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Submissions List */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-lg">Vos Vidéos Soumises</h3>
              <button onClick={fetchStats} className="text-sm text-gray-400 hover:text-white">Actualiser les stats</button>
            </div>
            
            <div className="divide-y divide-zinc-800">
              {submissions.map((sub) => (
                <motion.div 
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      sub.platform === 'TikTok' ? 'bg-black border border-zinc-700' : 
                      sub.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500' : 'bg-red-600'
                    }`}>
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a href={sub.video_url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:underline truncate max-w-[200px] block">
                        {sub.video_url}
                      </a>
                      <p className="text-xs text-gray-500">{new Date(sub.created_at).toLocaleDateString()} • {sub.platform}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-300 justify-end">
                        <Eye className="w-3 h-3" /> {(sub.views_count || 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">Vues validées</p>
                    </div>

                    <div className="text-right w-24">
                      <div className="font-bold text-green-400">+{(sub.earnings || 0).toFixed(2)} €</div>
                      <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                        sub.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                        sub.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {sub.status === 'approved' ? 'Payé' : sub.status === 'pending' ? 'En cours' : 'Rejeté'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {submissions.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Aucune vidéo soumise pour le moment.</p>
              </div>
            )}
          </div>

          {/* Payout History */}
          {payoutHistory.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="font-bold text-lg">Historique des Retraits</h3>
              </div>
              <div className="divide-y divide-zinc-800">
                {payoutHistory.map((payout) => (
                  <div key={payout.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{payout.amount.toFixed(2)} €</div>
                      <div className="text-xs text-gray-500">
                        {new Date(payout.created_at).toLocaleDateString()} • {payout.method.toUpperCase()}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      payout.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      payout.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {payout.status === 'approved' ? 'Payé' : payout.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
