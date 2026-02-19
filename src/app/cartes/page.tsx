import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { generateSiteMetadata } from '@/lib/metadata';
import CarteClient from '@/components/map/CarteClient';
import { cachedEstablishmentService, cachedCategoryService, cachedQuartierService } from '@/lib/cached-api';
import { transformEstablishmentList } from '@/lib/apiTransformers';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

async function CarteContent() {
  let establishments = [];
  let categories = [];
  let quartiers = [];

  try {
    // Charger tous les établissements
    const establishmentsResponse = await cachedEstablishmentService.getAll();
    const establishmentsList = (establishmentsResponse as any)?.results || establishmentsResponse || [];
    establishments = establishmentsList
      .map(transformEstablishmentList)
      .filter((est: any) => est && est.latitude && est.longitude);

    // Charger les catégories
    const categoriesResponse = await cachedCategoryService.getAll();
    categories = (categoriesResponse as any) || [];

    // Charger les quartiers
    const quartiersResponse = await cachedQuartierService.getAll();
    quartiers = (quartiersResponse as any) || [];
  } catch (error) {
    console.error('Error loading data for map:', error);
  }

  return (
    <CarteClient
      establishments={establishments}
      categories={categories}
      quartiers={quartiers}
    />
  );
}

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
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de la carte...</p>
              </div>
            </div>
          }
        >
          <CarteContent />
        </Suspense>
      </div>
    </div>
  );
}