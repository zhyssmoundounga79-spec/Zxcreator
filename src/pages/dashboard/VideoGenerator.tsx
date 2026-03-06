import { useState, FormEvent, useEffect } from 'react';
import { Loader2, Video, Download, AlertCircle, Key, Hash, Settings, Zap, CheckCircle, Clock, Monitor, Music, Coins, Gauge } from 'lucide-react';
import { motion } from 'motion/react';
import { generateVideo, generateHashtags } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function VideoGenerator() {
  const { user, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'automate'>('create');
  
  // Creation State
  const [prompt, setPrompt] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [duration, setDuration] = useState('15s');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [resolution, setResolution] = useState('720p');
  const [music, setMusic] = useState('Cinematic');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState('');
  const { addToHistory } = useSearch();

  // Automation State
  const [autoNiche, setAutoNiche] = useState('');
  const [autoFrequency, setAutoFrequency] = useState('daily');
  const [socialLink, setSocialLink] = useState('');
  const [autoEnabled, setAutoEnabled] = useState(false);

  const messages = [
    "Initialisation du moteur Veo...",
    "Analyse de votre prompt créatif...",
    "Génération des premières frames...",
    "Calcul de la physique et de la lumière...",
    "Assemblage de la séquence vidéo...",
    `Optimisation de la qualité ${resolution}...`,
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

  const calculateCost = () => {
    let baseCost = 10; // Base for 15s, 720p, simple prompt

    // Duration Multiplier
    if (duration === '30s') baseCost *= 2;
    if (duration === '60s') baseCost *= 4;

    // Resolution Multiplier (Quality)
    if (resolution === '1080p') baseCost *= 2;
    if (resolution === '4k') baseCost *= 4;

    // Complexity (Prompt Length)
    if (prompt.length > 150) baseCost *= 1.5;
    else if (prompt.length > 50) baseCost *= 1.2;

    // Music
    if (music === 'AI Generated') baseCost += 5;
    else if (music !== 'No Music') baseCost += 2;

    // Add Hashtag generation cost
    baseCost += 5;

    return Math.round(baseCost);
  };

  const cost = calculateCost();

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasKey) {
      setError("Veuillez sélectionner une clé API pour utiliser Veo.");
      return;
    }

    if (user && user.balance < cost) {
      setError(`Solde insuffisant. Il vous faut ${cost} crédits, mais vous n'en avez que ${user.balance}.`);
      return;
    }

    setLoading(true);
    setError('');
    setVideoUrl(null);
    setHashtags(null);

    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[msgIndex % messages.length]);
      msgIndex++;
    }, 8000);

    try {
      // Parallel generation for efficiency
      const [vidResponse, tagsResponse] = await Promise.all([
        generateVideo(`${prompt}. Niche: ${niche}. Platform: ${platform}`, duration, aspectRatio, resolution, music),
        generateHashtags(prompt, niche)
      ]);
      
      if (vidResponse && vidResponse.videoUrl) {
        setVideoUrl(vidResponse.videoUrl);
      }

      if (tagsResponse && tagsResponse.hashtags) {
        setHashtags(tagsResponse.hashtags);
      }

      // Update balance with the lowest value returned (most up to date)
      if (user) {
        const bal1 = vidResponse?.newBalance ?? user.balance;
        const bal2 = tagsResponse?.newBalance ?? user.balance;
        updateBalance(Math.min(bal1, bal2));
      }

      // Save to history
      if (vidResponse?.videoUrl) {
        addToHistory({
          type: 'video',
          title: `Vidéo: ${prompt}`,
          content: `Vidéo générée pour ${platform} sur le thème ${niche}. Hashtags: ${tagsResponse?.hashtags?.high?.join(', ')}`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setError("La génération a échoué. Assurez-vous d'utiliser une clé API valide avec facturation activée.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleSaveAutomation = (e: FormEvent) => {
    e.preventDefault();
    setAutoEnabled(true);
    // In a real app, this would save to backend
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
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Video className="text-red-500" /> Studio Vidéo Veo
          </h1>
          <p className="text-gray-400">Créez, automatisez et viralisez vos vidéos.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-mono font-bold text-white">{user?.balance || 0}</span>
            <span className="text-xs text-gray-500">crédits</span>
          </div>

          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'create' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Création
            </button>
            <button
              onClick={() => setActiveTab('automate')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'automate' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" /> Automatisation
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'create' ? (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="md:col-span-1">
            <form onSubmit={handleGenerate} className="space-y-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sujet de la vidéo</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Un astronaute marchant sur Mars..."
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white h-32 resize-none"
                  required
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {prompt.length} caractères (Complexité: {prompt.length > 150 ? 'Élevée' : prompt.length > 50 ? 'Moyenne' : 'Faible'})
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Votre Niche</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: Tech, Voyage..."
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Plateforme</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Durée
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white"
                  >
                    <option value="15s">15 secondes</option>
                    <option value="30s">30 secondes (x2)</option>
                    <option value="60s">60 secondes (x4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> Format
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white"
                  >
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="16:9">16:9 (Horizontal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Gauge className="w-4 h-4" /> Résolution (Qualité)
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white"
                >
                  <option value="720p">720p HD (Standard)</option>
                  <option value="1080p">1080p Full HD (x2)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Music className="w-4 h-4" /> Ambiance Sonore
                </label>
                <select
                  value={music}
                  onChange={(e) => setMusic(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-red-500 focus:outline-none text-white"
                >
                  <option value="No Music">Aucune (Silencieux)</option>
                  <option value="Cinematic">Cinématique & Épique (+2)</option>
                  <option value="Upbeat">Dynamique & Joyeux (+2)</option>
                  <option value="Lo-Fi">Lo-Fi & Détente (+2)</option>
                  <option value="AI Generated">Générée par IA (+5)</option>
                </select>
              </div>

              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Coût estimé</span>
                  <span className="text-xl font-bold text-white flex items-center gap-1">
                    {cost} <Coins className="w-4 h-4 text-yellow-500" />
                  </span>
                </div>
                <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${user && user.balance >= cost ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ width: `${Math.min((user?.balance || 0) / cost * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-right mt-1 text-gray-500">
                  Solde: {user?.balance || 0} crédits
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (user ? user.balance < cost : true)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Générer Vidéo + Hashtags'}
              </button>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Result Column */}
          <div className="md:col-span-2 space-y-6">
            {loading ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  <Video className="absolute inset-0 m-auto w-10 h-10 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Création en cours...</h3>
                <p className="text-gray-400 animate-pulse">{loadingMessage}</p>
              </div>
            ) : videoUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Video Player */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
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
                      <p className="text-sm text-gray-500">Format: {resolution} ({aspectRatio})</p>
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
                </div>

                {/* Hashtags */}
                {hashtags && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-pink-400" /> Hashtags Suggérés
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.high?.slice(0, 5).map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm border border-purple-500/20">{tag}</span>
                      ))}
                      {hashtags.medium?.slice(0, 5).map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-12 border-2 border-dashed border-zinc-800 rounded-2xl min-h-[400px]">
                <Video className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-center max-w-xs">Décrivez une scène pour commencer la génération vidéo avec l'IA Veo.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Automation Tab */
        <div className="max-w-2xl mx-auto">
          {user?.plan === 'free' ? (
            <div className="text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Automatisation Réservée aux Pros</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Passez au plan Pro ou Elite pour débloquer la génération et publication automatique de vidéos.
              </p>
              <Link to="/pricing" className="px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors">
                Voir les offres
              </Link>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Auto-Pilote</h2>
                  <p className="text-gray-400 text-sm">
                    {user?.plan === 'pro' ? '1 Vidéo / jour générée automatiquement' : 'Publication automatique illimitée'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${autoEnabled ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-800 text-gray-500 border-zinc-700'}`}>
                  {autoEnabled ? 'ACTIF' : 'INACTIF'}
                </div>
              </div>

              <form onSubmit={handleSaveAutomation} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Niche Cible</label>
                  <input
                    type="text"
                    value={autoNiche}
                    onChange={(e) => setAutoNiche(e.target.value)}
                    placeholder="Ex: Motivation, Finance..."
                    className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Fréquence de Publication</label>
                  <select
                    value={autoFrequency}
                    onChange={(e) => setAutoFrequency(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
                    disabled={user?.plan === 'pro'}
                  >
                    <option value="daily">Quotidien (1 vidéo / jour)</option>
                    {user?.plan === 'elite' && (
                      <>
                        <option value="twice_daily">Intensif (2 vidéos / jour)</option>
                        <option value="weekly">Hebdomadaire (1 vidéo / semaine)</option>
                        <option value="custom">Optimisé par IA (Recommandé)</option>
                      </>
                    )}
                  </select>
                  {user?.plan === 'pro' && (
                    <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">
                      <Settings className="w-3 h-3" /> Le plan Pro est limité à 1 vidéo par jour. Passez Elite pour plus d'options.
                    </p>
                  )}
                </div>

                {user?.plan === 'elite' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Lien du Compte (Auto-Post)</label>
                    <input
                      type="url"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      placeholder="https://tiktok.com/@votrecompte"
                      className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-purple-500 focus:outline-none text-white"
                    />
                    <p className="text-xs text-gray-500 mt-2">Nous utiliserons ce lien pour configurer le webhook de publication.</p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-black/30 border border-zinc-800">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Résumé de l'automatisation
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Fréquence : {autoFrequency === 'daily' ? '1 vidéo / 24h' : autoFrequency === 'twice_daily' ? '2 vidéos / 24h' : 'Optimisée par IA'}</li>
                    <li>• Mode : {user?.plan === 'elite' ? 'Génération + Publication' : 'Génération seule'}</li>
                    <li>• Notification : Email à chaque succès</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                >
                  {autoEnabled ? 'Mettre à jour les paramètres' : 'Activer l\'Auto-Pilote'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
