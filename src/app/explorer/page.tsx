import { Suspense } from 'react';
import SearchBar from '@/components/establishments/SearchBar';
import FilterChips from '@/components/establishments/FilterChips';
import AdvancedFilters from '@/components/establishments/AdvancedFilters';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import EstablishmentCardSkeleton from '@/components/ui/EstablishmentCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import MobileFiltersButton from '@/components/establishments/MobileFiltersButton';
import { cachedEstablishmentService } from '@/lib/cached-api';
import { transformEstablishmentList } from '@/lib/apiTransformers';

async function EstablishmentsList({
  q,
  category,
  neighborhood,
  minRating,
  page,
}: {
  q?: string;
  category?: string;
  neighborhood?: string;
  minRating?: string;
  page: number;
}) {
  try {
    const pageSize = 12;

    // Construire les paramètres de filtre
    const params: any = {
      page,
      page_size: pageSize,
    };

    // Ajouter la recherche si présente
    if (q) {
      params.search = q;
    }

    // Ajouter les filtres
    if (category && category !== 'all') {
      params.categorie = category;
    }

    if (neighborhood) {
      params.quartier = neighborhood;
    }

    if (minRating) {
      params.note_min = parseFloat(minRating);
    }

    // Toujours utiliser getAll qui supporte tous les paramètres
    const response = await cachedEstablishmentService.getAll(params);

    const establishments = response.results.map(transformEstablishmentList);

    if (establishments.length === 0) {
      return (
        <EmptyState
          title="Aucun établissement trouvé"
          message="Essayez de modifier vos critères de recherche ou explorez d'autres catégories."
        />
      );
    }

    const totalPages = response.total_pages || Math.ceil(response.count / pageSize);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {establishments.map((establishment, index) => (
            <EstablishmentCard 
              key={establishment.id} 
              establishment={establishment}
              index={index}
            />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalCount={response.count}
          pageSize={pageSize}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading establishments:', error);
    return (
      <EmptyState
        title="Erreur de chargement"
        message="Impossible de charger les établissements. Vérifiez votre connexion."
      />
    );
  }
}

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    q?: string; 
    category?: string;
    neighborhood?: string;
    minRating?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  return (
    <div className="min-h-screen bg-light">
      {/* Header de la page */}
      <div className="bg-gradient-to-r from-dark to-dark/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Explorer</h1>
          <p className="text-white/80 text-lg">
            Découvrez les meilleurs établissements de Brazzaville
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Filtres rapides */}
        <div className="mb-8">
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
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <EstablishmentCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <EstablishmentsList 
                q={params.q}
                category={params.category}
                neighborhood={params.neighborhood}
                minRating={params.minRating}
                page={page}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Bouton filtres mobile */}
      <MobileFiltersButton />
    </div>
  );
}