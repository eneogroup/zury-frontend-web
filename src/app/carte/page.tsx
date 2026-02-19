import { Metadata } from 'next';
import { generateSiteMetadata } from '@/lib/metadata';
import MapView from '@/components/map/MapView';
import '../../styles/map-infowindow.css';

export const metadata: Metadata = generateSiteMetadata({
  title: 'Carte des établissements',
  description: 'Découvrez tous les restaurants, bars, hôtels et lounges de Brazzaville et Pointe-Noire sur une carte interactive.',
  keywords: [
    'carte restaurants Brazzaville',
    'carte bars Brazzaville',
    'carte interactive Congo',
    'plan Brazzaville',
  ],
});

export default function CartePage() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header fixe */}
      <div className="bg-dark text-white py-4 px-4 sm:px-6 lg:px-8 shadow-lg z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Carte des établissements</h1>
          <p className="text-white/80 text-sm mt-1">
            Explorez tous les établissements de Brazzaville
          </p>
        </div>
      </div>

      {/* Carte plein écran */}
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
}