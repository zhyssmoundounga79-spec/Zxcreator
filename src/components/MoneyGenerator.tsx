import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Zap, ShieldAlert, Cpu, Lock, Unlock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MoneyGenerator() {
  const { user, updateBalance } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  // Only for Z Space members (or everyone if we want to tease it)
  // Let's make it available but "risky" looking
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        // Add 1€ every second
        if (user) {
          updateBalance(user.balance + 1);
          
          // Add log
          const newLog = `[SYSTEM_OVERRIDE] Block mined: +1.00€ [HASH: ${Math.random().toString(36).substring(7)}]`;
          setLogs(prev => [newLog, ...prev].slice(0, 10));
          
          // Glitch effect
          setGlitchIntensity(Math.random());
          setTimeout(() => setGlitchIntensity(0), 100);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, user, updateBalance]);

  const toggleGenerator = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setLogs(prev => ["Initializing Z-Protocol v1.0...", "Bypassing security firewall...", "Connection established.", ...prev]);
    } else {
      setLogs(prev => ["Connection terminated.", ...prev]);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black border border-green-500/30 p-6 shadow-[0_0_30px_rgba(0,255,0,0.1)]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Glitch Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: glitchIntensity * 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-500 mix-blend-overlay pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-green-500 text-black animate-pulse' : 'bg-zinc-900 text-green-500'}`}>
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-green-400 text-lg flex items-center gap-2">
                Z-MINER v1.0
                {isActive && <span className="text-[10px] bg-green-500 text-black px-1 rounded animate-pulse">ACTIVE</span>}
              </h3>
              <p className="text-xs text-green-500/60 font-mono">Protocol: 1.00 EUR/s</p>
            </div>
          </div>
          
          <button
            onClick={toggleGenerator}
            className={`px-6 py-2 rounded-lg font-mono font-bold transition-all border ${
              isActive 
                ? 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20' 
                : 'bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20'
            }`}
          >
            {isActive ? 'TERMINATE' : 'INITIALIZE'}
          </button>
        </div>

        {/* Terminal Window */}
        <div className="bg-black/80 rounded-lg border border-green-500/20 p-4 font-mono text-xs h-48 overflow-hidden relative">
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          
          <div className="space-y-1 text-green-500/80">
            {logs.length === 0 && <span className="opacity-50">System ready. Waiting for command...</span>}
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="truncate"
              >
                <span className="text-green-300">{'>'}</span> {log}
              </motion.div>
            ))}
          </div>
          
          {/* Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-4 w-full animate-scan pointer-events-none" />
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500/40 font-mono border-t border-green-500/10 pt-2">
          <ShieldAlert className="w-3 h-3" />
          WARNING: UNAUTHORIZED USE OF THIS MODULE MAY VIOLATE Z-SPACE PROTOCOLS. USE AT YOUR OWN RISK.
        </div>
      </div>
    </div>
  );
}
