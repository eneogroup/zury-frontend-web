// Si c'est dans src/app/carte/page.tsx
import MapView from '@/components/map/MapView';

export default async function CartePage() {
  // Pour l'instant, retourner une page simple
  return (
    <div className="min-h-screen bg-light">
      <div className="bg-gradient-to-r from-dark to-dark/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Carte</h1>
          <p className="text-white/80 text-lg">
            Trouvez les établissements près de vous
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-gray-600 mb-4">La carte interactive sera bientôt disponible.</p>
          <p className="text-sm text-gray-400">Google Maps en cours d'intégration</p>
        </div>
      </div>
    </div>
  );
}