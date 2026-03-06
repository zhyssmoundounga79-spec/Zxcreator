import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-purple-400 hover:underline mb-8 block">&larr; Retour</Link>
        <h1 className="text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
        <p className="text-gray-400 mb-4">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
        <div className="space-y-4 text-gray-300">
          <p>En utilisant cette application, vous acceptez les présentes conditions.</p>
          <h2 className="text-xl font-bold text-white mt-6">1. Utilisation du service</h2>
          <p>Ce service est fourni "tel quel". L'utilisation abusive, y compris le contournement des systèmes de sécurité, est interdite.</p>
          <h2 className="text-xl font-bold text-white mt-6">2. Compte utilisateur</h2>
          <p>Vous êtes responsable de la sécurité de votre compte. Tout comportement suspect peut entraîner la suspension du compte.</p>
          <h2 className="text-xl font-bold text-white mt-6">3. Simulation de gains</h2>
          <p>Les fonctionnalités de "gains" (regarder des publicités) sont des simulations à des fins de démonstration et ne représentent pas de l'argent réel, sauf indication contraire explicite.</p>
        </div>
      </div>
    </div>
  );
}
