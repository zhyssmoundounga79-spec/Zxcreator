import { useState, FormEvent } from 'react';
import { Loader2, FileText, Copy, Check, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { generateScript } from '../../services/geminiService';

export default function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateScript(topic, niche, platform);
      if (result) setScript(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
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
              <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  Durée estimée: {script.estimatedDuration}
                </div>
                <button
                  onClick={() => copyToClipboard(`${script.hook}\n\n${script.problem}\n\n${script.solution}\n\n${script.cta}`, 'all')}
                  className="text-xs font-bold px-3 py-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  {copiedSection === 'all' ? 'Copié !' : 'Tout copier'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                {[
                  { label: 'HOOK (0-3s)', content: script.hook, color: 'text-pink-400', border: 'border-pink-500/20' },
                  { label: 'PROBLÈME', content: script.problem, color: 'text-orange-400', border: 'border-orange-500/20' },
                  { label: 'SOLUTION', content: script.solution, color: 'text-green-400', border: 'border-green-500/20' },
                  { label: 'CALL TO ACTION', content: script.cta, color: 'text-blue-400', border: 'border-blue-500/20' }
                ].map((section, i) => (
                  <div key={i} className={`p-4 rounded-xl bg-black/20 border ${section.border} relative group`}>
                    <div className={`text-xs font-bold mb-2 ${section.color}`}>{section.label}</div>
                    <p className="text-gray-200 leading-relaxed pr-8">{section.content}</p>
                    <button
                      onClick={() => copyToClipboard(section.content, section.label)}
                      className="absolute top-4 right-4 p-1.5 rounded bg-zinc-800 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                    >
                      {copiedSection === section.label ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
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
