import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions d\'utilisation.');
      return;
    }

    if (!tiktokHandle.startsWith('@')) {
      setError('Le compte TikTok doit commencer par @');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, tiktokHandle, referralCode }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      login(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Zxcreator Logo" className="w-12 h-12 rounded-xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-gray-400 mt-2">Rejoignez l'élite des créateurs de contenu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Compte TikTok (pour vérification)</label>
            <input
              type="text"
              value={tiktokHandle}
              onChange={(e) => setTiktokHandle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="@votre_pseudo"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Nécessaire pour éviter les abus du plan gratuit. Doit commencer par @.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Code de parrainage (Optionnel)</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Ex: a1b2c3d4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-600 bg-zinc-900 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-400">
              J'accepte les <Link to="/terms" className="text-purple-400 hover:underline">Conditions Générales d'Utilisation</Link> et la <Link to="/privacy" className="text-purple-400 hover:underline">Politique de Confidentialité</Link>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-white hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
