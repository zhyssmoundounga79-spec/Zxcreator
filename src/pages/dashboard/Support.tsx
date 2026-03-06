import { useState, FormEvent } from 'react';
import { MessageSquare, Send, HelpCircle, FileQuestion, Mail } from 'lucide-react';

export default function Support() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Centre d'Aide & Support
        </h1>
        <p className="text-gray-400">
          Comment pouvons-nous vous aider aujourd'hui ?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            Questions Fréquentes
          </h2>
          <div className="space-y-4">
            {[
              { q: "Comment changer mon plan ?", a: "Allez dans Paramètres > Abonnement pour modifier votre offre." },
              { q: "Les vidéos sont-elles libres de droits ?", a: "Oui, toutes les vidéos générées vous appartiennent à 100%." },
              { q: "Comment fonctionne le programme d'affiliation ?", a: "Partagez votre lien unique et gagnez 30% de commission à vie." },
              { q: "Puis-je annuler à tout moment ?", a: "Oui, l'annulation est immédiate depuis votre espace personnel." }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-white/5 rounded-xl p-4">
                <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-gray-500" />
                  {item.q}
                </h3>
                <p className="text-sm text-gray-400 pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-purple-400" />
            Nous contacter
          </h2>
          
          {sent ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Message envoyé !</h3>
              <p className="text-gray-400">Nous vous répondrons sous 24h.</p>
              <button 
                onClick={() => setSent(false)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Sujet</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-white">
                  <option>Problème technique</option>
                  <option>Question sur la facturation</option>
                  <option>Suggestion d'amélioration</option>
                  <option>Autre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-white resize-none"
                  placeholder="Décrivez votre problème en détail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
