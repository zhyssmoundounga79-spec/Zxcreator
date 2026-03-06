import { useState, useEffect } from 'react';
import { Gift, Check, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DailyBonusWidget() {
  const { user, claimDailyBonus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (user?.lastDailyBonus) {
      const lastBonusDate = new Date(user.lastDailyBonus).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      setClaimed(lastBonusDate === today);
    } else {
      setClaimed(false);
    }
  }, [user]);

  const handleClaim = async () => {
    setLoading(true);
    try {
      await claimDailyBonus();
      setClaimed(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (claimed) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-green-500/20 relative overflow-hidden h-full flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Check className="w-24 h-24 text-green-400" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-green-400 flex items-center gap-2 mb-1">
              <Check className="w-5 h-5" /> Bonus Réclamé
            </h3>
            <p className="text-xs text-gray-400">Revenez demain pour +10 crédits</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <Clock className="w-5 h-5 text-green-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 relative overflow-hidden group h-full">
      <div className="absolute -right-4 -top-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
        <Gift className="w-32 h-32 text-indigo-400" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-indigo-200 flex items-center gap-2">
              <Gift className="w-5 h-5" /> Bonus Quotidien
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse uppercase tracking-wider font-bold">
              Dispo
            </span>
          </div>
          
          <div className="text-3xl font-bold mb-1 text-white">
            +10 <span className="text-sm font-normal text-indigo-200/60">crédits</span>
          </div>
          <p className="text-xs text-indigo-200/60 mb-4">
            Cadeau de fidélité. Réclamez maintenant.
          </p>
        </div>
        
        <button
          onClick={handleClaim}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Patientez...
            </>
          ) : (
            <>
              Réclamer <Gift className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
