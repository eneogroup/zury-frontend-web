import { Suspense } from 'react';
import SearchBar from '@/components/establishments/SearchBar';
import FilterChips from '@/components/establishments/FilterChips';
import AdvancedFilters from '@/components/establishments/AdvancedFilters';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import EstablishmentCardSkeleton from '@/components/ui/EstablishmentCardSkeleton';
import MobileFiltersButton from '@/components/establishments/MobileFiltersButton';
import EmptyState from '@/components/ui/EmptyState';
import { mockEstablishments } from '@/lib/mockData';

function EstablishmentsList({
  searchParams,
}: {
  searchParams: { 
    q?: string; 
    category?: string; 
    neighborhood?: string;
    minRating?: string;
  };
}) {
  // TODO: Remplacer par un vrai appel API
  let establishments = mockEstablishments;

  // Filtrage par recherche
  if (searchParams.q) {
    establishments = establishments.filter((est) =>
      est.name.toLowerCase().includes(searchParams.q!.toLowerCase())
    );
  }

  // Filtrage par catégories (support multiple)
  if (searchParams.category) {
    const categories = searchParams.category.split(',');
    establishments = establishments.filter((est) =>
      categories.includes(est.category)
    );
  }

  // Filtrage par quartiers (support multiple)
  if (searchParams.neighborhood) {
    const neighborhoods = searchParams.neighborhood.split(',');
    establishments = establishments.filter((est) =>
      neighborhoods.includes(est.neighborhood)
    );
  }

  // Filtrage par note minimale
  if (searchParams.minRating) {
    const minRating = Number(searchParams.minRating);
    establishments = establishments.filter((est) => est.rating >= minRating);
  }

  if (establishments.length === 0) {
    return (
      <EmptyState
        title="Aucun établissement trouvé"
        message="Essayez de modifier vos critères de recherche ou explorez d'autres catégories."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {establishments.map((establishment, index) => (
        <EstablishmentCard 
          key={establishment.id} 
          establishment={establishment}
          index={index}
        />
      ))}
    </div>
  );
}

export default function ExplorerPage({
  searchParams,
}: {
  searchParams: { 
    q?: string; 
    category?: string;
    neighborhood?: string;
    minRating?: string;
  };
}) {
  // Calculer le nombre de résultats
  let resultCount = mockEstablishments.length;
  
  if (searchParams.q || searchParams.category || searchParams.neighborhood || searchParams.minRating) {
    let filtered = mockEstablishments;
    
    if (searchParams.q) {
      filtered = filtered.filter((est) =>
        est.name.toLowerCase().includes(searchParams.q!.toLowerCase())
      );
    }
    if (searchParams.category) {
      const categories = searchParams.category.split(',');
      filtered = filtered.filter((est) => categories.includes(est.category));
    }
    if (searchParams.neighborhood) {
      const neighborhoods = searchParams.neighborhood.split(',');
      filtered = filtered.filter((est) => neighborhoods.includes(est.neighborhood));
    }
    if (searchParams.minRating) {
      const minRating = Number(searchParams.minRating);
      filtered = filtered.filter((est) => est.rating >= minRating);
    }
    
    resultCount = filtered.length;
  }

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-4">Explorer</h1>
          <SearchBar />
        </div>

        {/* Filtres rapides (chips) */}
        <div className="mb-6">
          <FilterChips />
        </div>

        {/* Layout avec sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filtres avancés (desktop uniquement) */}
          <aside className="hidden lg:block">
            <AdvancedFilters />
          </aside>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Nombre de résultats */}
            <div className="mb-6">
              <p className="text-gray">
                <span className="font-semibold text-dark">{resultCount}</span> résultat{resultCount > 1 ? 's' : ''} trouvé{resultCount > 1 ? 's' : ''}
              </p>
            </div>

            {/* Grille d'établissements avec loading state */}
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <EstablishmentCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <EstablishmentsList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
      {/* Bouton filtres mobile */}
      <MobileFiltersButton />
    </div>
  );
}