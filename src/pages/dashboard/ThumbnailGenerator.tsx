import { useState, FormEvent } from 'react';
import { Loader2, Image as ImageIcon, Palette, Type, Smile } from 'lucide-react';
import { motion } from 'motion/react';
import { generateThumbnails } from '../../services/geminiService';

export default function ThumbnailGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateThumbnails(topic, niche);
      if (result) setThumbnails(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ImageIcon className="text-pink-400" /> Idées de Miniatures
        </h1>
        <p className="text-gray-400">Des concepts visuels qui incitent au clic.</p>
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
                placeholder="Ex: Vlog Voyage Japon..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-pink-500 focus:outline-none text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Votre Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Voyage, Lifestyle..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-pink-500 focus:outline-none text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Générer des Concepts'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-6">
          {!thumbnails.length && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-12 border-2 border-dashed border-zinc-800 rounded-2xl">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>Générez des concepts de miniatures.</p>
            </div>
          )}

          {thumbnails.map((thumb, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden"
            >
              <div className="h-48 bg-zinc-800 relative flex items-center justify-center overflow-hidden group">
                {/* Mock Visual Representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
                <div className="text-center p-6 relative z-10">
                  <p className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow-lg transform -rotate-2">
                    {thumb.textOverlay}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white">
                  Aperçu Conceptuel
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="font-bold text-lg mb-2 text-white">Description Visuelle</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{thumb.visualDescription}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-pink-400"><Palette className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Couleurs</div>
                    <div className="text-sm text-gray-300">{thumb.colorScheme}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-yellow-400"><Smile className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Émotion</div>
                    <div className="text-sm text-gray-300">{thumb.emotion}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
