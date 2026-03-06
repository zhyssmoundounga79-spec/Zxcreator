import { useState, FormEvent } from 'react';
import { Loader2, Hash, Copy, Check, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { generateHashtags } from '../../services/geminiService';
import { useSearch } from '../../context/SearchContext';

interface HashtagResult {
  high: string[];
  medium: string[];
  low: string[];
}

export default function HashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [hashtags, setHashtags] = useState<HashtagResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { addToHistory } = useSearch();

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic || !niche) return;

    setLoading(true);
    try {
      const result = await generateHashtags(topic, niche);
      if (result) {
        setHashtags(result);
        // Save to history
        addToHistory({
          type: 'hashtag',
          title: `Hashtags: ${topic}`,
          content: [...result.high, ...result.medium, ...result.low].join(' '),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    if (!hashtags) return;
    const allTags = [...hashtags.high, ...hashtags.medium, ...hashtags.low].join(' ');
    copyToClipboard(allTags, 'all');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Hash className="text-pink-400" /> Générateur de Hashtags
        </h1>
        <p className="text-gray-400">Boostez votre visibilité avec des hashtags ciblés et optimisés pour votre niche.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleGenerate} className="space-y-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 sticky top-24">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sujet de la vidéo</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Voyage économique..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-pink-500 focus:outline-none text-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Votre Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Travel, Lifestyle..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-pink-500 focus:outline-none text-white transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !topic || !niche}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer les Hashtags
                </>
              )}
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          {!hashtags && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-12 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/50">
              <Hash className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Entrez un sujet pour générer des hashtags</p>
              <p className="text-sm opacity-60 mt-2">L'IA analysera votre niche pour trouver les meilleurs tags.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center p-12">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-400 animate-pulse">Analyse des tendances en cours...</p>
            </div>
          )}

          {hashtags && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={copyAll}
                  className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                >
                  {copied === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'all' ? 'Tout copié !' : 'Copier tous les hashtags'}
                </button>
              </div>

              {[
                { title: 'Volume Élevé (Large Audience)', data: hashtags.high, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', description: 'Pour toucher un maximum de personnes.' },
                { title: 'Volume Moyen (Niche)', data: hashtags.medium, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', description: 'Pour cibler votre audience idéale.' },
                { title: 'Volume Faible (Spécifique)', data: hashtags.low, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', description: 'Pour dominer des sujets précis.' },
              ].map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-2xl bg-zinc-900 border border-zinc-800 relative group hover:border-zinc-700 transition-colors`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-bold flex items-center gap-2 ${section.color} text-lg`}>
                        <TrendingUp className="w-5 h-5" />
                        {section.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(section.data.join(' '), section.title)}
                      className="text-xs font-bold px-3 py-1.5 rounded bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-2"
                    >
                      {copied === section.title ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === section.title ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {section.data.map((tag: string, j: number) => (
                      <span 
                        key={j} 
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${section.bg} ${section.color} border ${section.border} cursor-pointer hover:opacity-80 transition-opacity select-all`}
                        onClick={() => copyToClipboard(tag, tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
