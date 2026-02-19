import { Metadata } from 'next';
import { generateSiteMetadata } from '@/lib/metadata';
import MapView from '@/components/map/MapView';

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
    <div className="flex flex-col h-screen">
      {/* Header - Compact sur mobile, normal sur desktop */}
      <div className="bg-dark text-white py-2 px-4 md:py-3 md:px-6 lg:px-8 shadow-lg z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-base md:text-xl lg:text-2xl font-bold">
            Carte des établissements
          </h1>
          <p className="text-white/80 text-xs md:text-sm mt-0.5 hidden md:block">
            Explorez tous les établissements de Brazzaville
          </p>
        </div>
      </div>

      {/* Carte en plein écran */}
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
}