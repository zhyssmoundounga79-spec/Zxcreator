import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-purple-400 hover:underline mb-8 block">&larr; Retour</Link>
        <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
        <p className="text-gray-400 mb-4">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
        <div className="space-y-4 text-gray-300">
          <p>Nous respectons votre vie privée.</p>
          <h2 className="text-xl font-bold text-white mt-6">1. Données collectées</h2>
          <p>Nous collectons votre email et votre nom pour la gestion de votre compte. Votre mot de passe est chiffré.</p>
          <h2 className="text-xl font-bold text-white mt-6">2. Utilisation des données</h2>
          <p>Vos données ne sont utilisées que pour le fonctionnement du service et ne sont pas vendues à des tiers.</p>
          <h2 className="text-xl font-bold text-white mt-6">3. Vos droits</h2>
          <p>Conformément au RGPD, vous pouvez demander la suppression de vos données à tout moment en nous contactant.</p>
        </div>
      </div>
    </div>
  );
}
