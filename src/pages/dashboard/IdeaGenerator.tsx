import { useState, FormEvent } from 'react';
import { Loader2, Sparkles, Copy, Check, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { generateIdeas } from '../../services/geminiService';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';

export default function IdeaGenerator() {
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [goal, setGoal] = useState('Vues');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { addToHistory } = useSearch();
  const { updateBalance } = useAuth();

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generateIdeas(niche, platform, goal);
      if (response && response.ideas) {
        setIdeas(response.ideas);
        if (response.newBalance !== undefined) {
          updateBalance(response.newBalance);
        }
        // Save to history
        response.ideas.forEach((idea: any) => {
          addToHistory({
            type: 'idea',
            title: idea.title,
            content: idea.description,
          });
        });
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la génération. Vérifiez votre solde.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="text-yellow-400" /> Générateur d'Idées Virales
        </h1>
        <p className="text-gray-400">Trouvez votre prochain concept à 1 million de vues.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleGenerate} className="space-y-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Votre Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Fitness, Crypto, Humour..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plateforme</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
              >
                <option value="TikTok">TikTok</option>
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="LinkedIn">LinkedIn Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Objectif</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
              >
                <option value="Vues">Maximiser les Vues</option>
                <option value="Abonnés">Gagner des Abonnés</option>
                <option value="Ventes">Générer des Ventes</option>
                <option value="Engagement">Créer de l'Engagement</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Générer 20 Idées'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-4">
          {ideas.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-12 border-2 border-dashed border-zinc-800 rounded-2xl">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p>Remplissez le formulaire pour générer des idées.</p>
            </div>
          )}

          {ideas.map((idea, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/30 transition-colors group relative"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{idea.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{idea.description}</p>
                  {idea.trendSource && (
                    <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded w-fit border border-purple-500/20">
                      <Sparkles className="w-3 h-3" />
                      <span>Tendance : {idea.trendSource}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${getScoreColor(idea.viralScore)}`}>
                    <TrendingUp className="w-3 h-3" />
                    {idea.viralScore}/100
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${idea.title}\n${idea.description}`, i)}
                    className="p-2 rounded-lg bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    {copiedIndex === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
