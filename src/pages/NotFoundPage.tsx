import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-lg">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl shadow-purple-500/20 rotate-12">
            <AlertTriangle className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white">Page introuvable</h2>
          <p className="text-gray-400">
            Oups ! La page que vous recherchez semble avoir disparu dans le cyberespace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Aller au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
