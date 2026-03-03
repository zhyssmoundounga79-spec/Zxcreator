import { useState, FormEvent } from 'react';
import { Loader2, Zap, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { generateHooks } from '../../services/geminiService';

export default function HookGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [hooks, setHooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateHooks(topic, niche);
      if (result) setHooks(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Zap className="text-purple-400" /> Générateur de Hooks
        </h1>
        <p className="text-gray-400">Capturez l'attention instantanément avec ces phrases d'accroche.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleGenerate} className="space-y-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sujet de la vidéo</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Productivité, Crypto..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Votre Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Business, Lifestyle..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Générer 10 Hooks'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-3">
          {!hooks.length && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-12 border-2 border-dashed border-zinc-800 rounded-2xl">
              <Zap className="w-12 h-12 mb-4 opacity-20" />
              <p>Générez des hooks pour voir les résultats.</p>
            </div>
          )}

          {hooks.map((hook, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-colors flex items-center justify-between group"
            >
              <p className="font-medium text-lg text-gray-200">"{hook}"</p>
              <button
                onClick={() => copyToClipboard(hook, i)}
                className="p-2 rounded-lg bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                {copiedIndex === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
