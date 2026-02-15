import MapView from '@/components/map/MapView';
import { mockEstablishments } from '@/lib/mockData';

export default function MapPage() {
  // TODO: Remplacer par un vrai appel API
  // const establishments = await establishmentService.getAll();
  
  const establishments = mockEstablishments;

  return (
    <div className="bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-6">Carte Interactive</h1>
        <MapView establishments={establishments} />
      </div>
    </div>
  );
}