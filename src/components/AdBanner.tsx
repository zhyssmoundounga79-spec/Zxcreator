import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AdBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full p-4 my-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full bg-black/50 text-gray-400 hover:text-white"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-black text-xs text-center p-1">
          PUB
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">Devenez Viral Plus Vite !</h4>
          <p className="text-xs text-gray-400 mt-1">
            Passez à la version PRO pour supprimer les publicités et débloquer l'IA illimitée.
          </p>
          <a href="/pricing" className="inline-block mt-2 text-xs font-bold text-purple-400 hover:text-purple-300">
            Voir les offres &rarr;
          </a>
        </div>
      </div>
      
      {/* Mock Ad Script / Tracking Pixel would go here */}
      <div className="absolute bottom-1 right-2 text-[10px] text-zinc-700">Publicité Sponsorisée</div>
    </div>
  );
}
