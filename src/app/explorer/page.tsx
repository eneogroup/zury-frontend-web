import { Suspense } from 'react';
import SearchBar from '@/components/establishments/SearchBar';
import FilterChips from '@/components/establishments/FilterChips';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import EstablishmentCardSkeleton from '@/components/ui/EstablishmentCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { mockEstablishments } from '@/lib/mockData';

function EstablishmentsList({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  // TODO: Remplacer par un vrai appel API
  let establishments = mockEstablishments;

  // Filtrage simple (temporaire)
  if (searchParams.q) {
    establishments = establishments.filter((est) =>
      est.name.toLowerCase().includes(searchParams.q!.toLowerCase())
    );
  }

  if (searchParams.category) {
    establishments = establishments.filter(
      (est) => est.category === searchParams.category
    );
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  searchParams: { q?: string; category?: string };
}) {
  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-4">Explorer</h1>
          <SearchBar />
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <FilterChips />
        </div>

        {/* Résultats avec loading state */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}