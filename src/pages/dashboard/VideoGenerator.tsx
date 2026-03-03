import { useState, FormEvent, useEffect } from 'react';
import { Loader2, Video, Download, AlertCircle, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { generateVideo } from '../../services/geminiService';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState('');

  const messages = [
    "Initialisation du moteur Veo...",
    "Analyse de votre prompt créatif...",
    "Génération des premières frames...",
    "Calcul de la physique et de la lumière...",
    "Assemblage de la séquence vidéo...",
    "Optimisation de la qualité 720p...",
    "Finalisation de votre chef-d'œuvre..."
  ];

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error("Error checking API key:", e);
    }
  };

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } catch (e) {
      console.error("Error opening key selector:", e);
    }
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasKey) {
      setError("Veuillez sélectionner une clé API pour utiliser Veo.");
      return;
    }

    setLoading(true);
    setError('');
    setVideoUrl(null);

    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[msgIndex % messages.length]);
      msgIndex++;
    }, 8000);

    try {
      const url = await generateVideo(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      setError("La génération a échoué. Assurez-vous d'utiliser une clé API valide avec facturation activée.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
          <Key className="w-10 h-10 text-purple-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Clé API Requise</h1>
        <p className="text-gray-400 mb-8">
          La génération de vidéo via Veo nécessite une clé API Google Cloud avec facturation activée.
          Vos crédits Zxcreator ne couvrent pas encore ce service haute performance.
        </p>
        <button
          onClick={handleSelectKey}
          className="px-8 py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
        >
          Sélectionner ma clé API
        </button>
        <p className="mt-4 text-xs text-gray-500">
          Consultez la <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">documentation sur la facturation</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Video className="text-red-500" /> Générateur Vidéo Veo
        </h1>
        <p className="text-gray-400">Créez des vidéos cinématiques à partir de texte.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleGenerate} className="space-y-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description de la vidéo</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Un astronaute marchant sur Mars dans un style cyberpunk, éclairage néon..."
                className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white h-40 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Générer la Vidéo'}
            </button>
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="md:col-span-2">
          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <Video className="absolute inset-0 m-auto w-10 h-10 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Création en cours...</h3>
              <p className="text-gray-400 animate-pulse">{loadingMessage}</p>
              <p className="text-xs text-gray-600 mt-8 italic">Cela peut prendre jusqu'à 2-3 minutes. Ne fermez pas cette page.</p>
            </div>
          ) : videoUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <video 
                src={videoUrl} 
                controls 
                className="w-full aspect-video bg-black"
                autoPlay
                loop
              />
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">Vidéo Générée</h3>
                  <p className="text-sm text-gray-500">Format: 720p HD (16:9)</p>
                </div>
                <a 
                  href={videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                >
                  <Download className="w-4 h-4" /> Télécharger
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 p-12 border-2 border-dashed border-zinc-800 rounded-2xl">
              <Video className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-center max-w-xs">Décrivez une scène pour commencer la génération vidéo avec l'IA Veo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
