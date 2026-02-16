import MapView from '@/components/map/MapView';
import { cachedEstablishmentService } from '@/lib/cached-api';
import { transformEstablishmentList } from '@/lib/apiTransformers';
import ErrorMessage from '@/components/ui/ErrorMessage';

export const revalidate = 300; // Revalider toutes les 5 minutes

export default async function CartePage() {
  try {
    // Récupérer tous les établissements
    const response = await cachedEstablishmentService.getAll({
      page: 1,
      page_size: 100, // Récupérer beaucoup d'établissements pour la carte
    });

    const establishments = response.results.map(transformEstablishmentList);

    return <MapView establishments={establishments} />;
  } catch (error) {
    console.error('Error loading map:', error);
    return (
      <div className="min-h-screen bg-light py-20">
        <ErrorMessage
          title="Erreur de chargement"
          message="Impossible de charger la carte. Vérifiez votre connexion."
        />
      </div>
    );
  }
}