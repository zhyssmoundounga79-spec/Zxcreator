import { useState, FormEvent } from 'react';
import { Loader2, FileText, Copy, Check, Clock, Zap, AlertCircle, Lightbulb, Megaphone, TrendingUp, Tag, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { generateScript } from '../../services/geminiService';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';

export default function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [length, setLength] = useState('Moyen (30-60s)');
  const [tone, setTone] = useState('Éducatif');
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { addToHistory } = useSearch();
  const { updateBalance } = useAuth();

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generateScript(topic, niche, platform, length, tone);
      if (response && response.script) {
        setScript(response.script);
        if (response.newBalance !== undefined) {
          updateBalance(response.newBalance);
        }
        addToHistory({
          type: 'script',
          title: `Script (${response.script.scriptType}): ${topic}`,
          content: response.script.hook + ' ' + response.script.problem + ' ' + response.script.solution + ' ' + response.script.cta,
        });
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la génération. Vérifiez votre solde.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  const getScriptTypeIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('education')) return <GraduationCap className="w-3.5 h-3.5 text-blue-400" />;
    if (normalizedType.includes('story')) return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
    if (normalizedType.includes('controvers')) return <AlertCircle className="w-3.5 h-3.5 text-blue-400" />;
    return <Tag className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="text-blue-400" /> Scripteur Viral
        </h1>
        <p className="text-gray-400">Transformez une idée en script captivant en quelques secondes.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleGenerate} className="space-y-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sujet de la vidéo</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Comment gagner 100€ par jour avec l'IA..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-blue-500 focus:outline-none text-white h-32 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Votre Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Business, Tech..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-blue-500 focus:outline-none text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Plateforme</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-blue-500 focus:outline-none text-white"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Durée</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-blue-500 focus:outline-none text-white"
                >
                  <option value="Court (< 30s)">Court (&lt; 30s)</option>
                  <option value="Moyen (30-60s)">Moyen (30-60s)</option>
                  <option value="Long (> 60s)">Long (&gt; 60s)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ton</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-blue-500 focus:outline-none text-white"
                >
                  <option value="Éducatif">Éducatif</option>
                  <option value="Humoristique">Humoristique</option>
                  <option value="Dramatique">Dramatique</option>
                  <option value="Inspirant">Inspirant</option>
                  <option value="Controversé">Controversé</option>
                  <option value="Professionnel">Professionnel</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Générer le Script'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="md:col-span-2">
          {!script && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-12 border-2 border-dashed border-zinc-800 rounded-2xl">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>Entrez un sujet pour générer un script.</p>
            </div>
          )}

          {script && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                    <Clock className="w-4 h-4" />
                    {script.estimatedDuration}
                  </div>
                  
                  {script.scriptType && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-medium text-gray-300">
                      {getScriptTypeIcon(script.scriptType)}
                      {script.scriptType}
                    </div>
                  )}
                  
                  {script.viralScore && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold ${getScoreColor(script.viralScore)}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      Score: {script.viralScore}/100
                    </div>
                  )}
                </div>

                <button
                  onClick={() => copyToClipboard(`${script.hook}\n\n${script.problem}\n\n${script.solution}\n\n${script.cta}`, 'all')}
                  className="text-xs font-bold px-3 py-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors whitespace-nowrap"
                >
                  {copiedSection === 'all' ? 'Copié !' : 'Tout copier'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                {[
                  { 
                    id: 'hook',
                    label: 'HOOK (0-3s)', 
                    content: script.hook, 
                    icon: Zap,
                    color: 'text-pink-400', 
                    bgColor: 'bg-pink-500/5',
                    borderColor: 'border-pink-500/20' 
                  },
                  { 
                    id: 'problem',
                    label: 'PROBLÈME', 
                    content: script.problem, 
                    icon: AlertCircle,
                    color: 'text-orange-400', 
                    bgColor: 'bg-orange-500/5',
                    borderColor: 'border-orange-500/20' 
                  },
                  { 
                    id: 'solution',
                    label: 'SOLUTION', 
                    content: script.solution, 
                    icon: Lightbulb,
                    color: 'text-green-400', 
                    bgColor: 'bg-green-500/5',
                    borderColor: 'border-green-500/20' 
                  },
                  { 
                    id: 'cta',
                    label: 'CALL TO ACTION', 
                    content: script.cta, 
                    icon: Megaphone,
                    color: 'text-blue-400', 
                    bgColor: 'bg-blue-500/5',
                    borderColor: 'border-blue-500/20' 
                  }
                ].map((section) => (
                  <div key={section.id} className={`p-5 rounded-xl border ${section.borderColor} ${section.bgColor} transition-all hover:bg-opacity-80`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-black/20 ${section.color}`}>
                          <section.icon className="w-4 h-4" />
                        </div>
                        <h3 className={`font-bold text-sm tracking-wide ${section.color}`}>{section.label}</h3>
                      </div>
                      <button
                        onClick={() => copyToClipboard(section.content, section.label)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/20 hover:bg-black/40 text-gray-400 hover:text-white transition-all border border-transparent hover:border-zinc-700"
                        title="Copier cette section"
                      >
                        {copiedSection === section.label ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-100 leading-relaxed text-base whitespace-pre-wrap font-medium">{section.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
