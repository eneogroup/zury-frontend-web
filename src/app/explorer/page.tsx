import { Suspense } from 'react';
import SearchBar from '@/components/establishments/SearchBar';
import FilterChips from '@/components/establishments/FilterChips';
import AdvancedFilters from '@/components/establishments/AdvancedFilters';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import EstablishmentCardSkeleton from '@/components/ui/EstablishmentCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import MobileFiltersButton from '@/components/establishments/MobileFiltersButton';
import { establishmentService } from '@/lib/api';
import { transformEstablishmentList } from '@/lib/apiTransformers';

async function EstablishmentsList({
  searchParams,
}: {
  searchParams: { 
    q?: string; 
    category?: string; 
    neighborhood?: string;
    minRating?: string;
    page?: string;
  };
}) {
  try {
    let response;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    // Si recherche active
    if (searchParams.q) {
      response = await establishmentService.search(searchParams.q, {
        page,
        page_size: 25,
      });
    } else {
      response = await establishmentService.getAll({
        page,
        page_size: 25,
        search: searchParams.q,
      });
    }

    let establishments = response.results.map(transformEstablishmentList);

    // Filtrage côté client (temporaire - à faire côté API plus tard)
    if (searchParams.category) {
      const categories = searchParams.category.split(',');
      establishments = establishments.filter((est) =>
        categories.includes(est.category)
      );
    }

    if (searchParams.neighborhood) {
      const neighborhoods = searchParams.neighborhood.split(',');
      establishments = establishments.filter((est) =>
        neighborhoods.includes(est.neighborhood)
      );
    }

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
  } catch (error) {
    console.error('Error loading establishments:', error);
    return (
      <ErrorMessage
        title="Erreur de chargement"
        message="Impossible de charger les établissements. Vérifiez votre connexion."
      />
    );
  }
}

export default function ExplorerPage({
  searchParams,
}: {
  searchParams: { 
    q?: string; 
    category?: string;
    neighborhood?: string;
    minRating?: string;
    page?: string;
  };
}) {
  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-4">Explorer</h1>
          <SearchBar />
        </div>

        {/* Filtres rapides */}
        <div className="mb-6">
          <FilterChips />
        </div>

        {/* Layout avec sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filtres avancés */}
          <aside className="hidden lg:block">
            <AdvancedFilters />
          </aside>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Grille d'établissements */}
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