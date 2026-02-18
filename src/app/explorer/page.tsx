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
import type { TransformedEstablishment } from '@/types';
import { Metadata } from 'next';
import { generateSiteMetadata } from '@/lib/metadata';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  
  let title = 'Explorer les établissements';
  let description = 'Découvrez tous les restaurants, bars, hôtels et lounges à Brazzaville et Pointe-Noire.';
  
  if (params.q) {
    title = `Recherche : ${params.q}`;
    description = `Résultats de recherche pour "${params.q}" - Trouvez les meilleurs établissements à Brazzaville.`;
  } else if (params.categorie) {
    const categoryNames: Record<string, string> = {
      '1': 'Restaurants',
      '2': 'Bars',
      '3': 'Hôtels',
      '4': 'Lounges',
    };
    const categoryName = categoryNames[params.categorie] || 'Établissements';
    title = `${categoryName} à Brazzaville`;
    description = `Découvrez les meilleurs ${categoryName.toLowerCase()} à Brazzaville et Pointe-Noire.`;
  }
  
  return generateSiteMetadata({
    title,
    description,
  });
}


async function EstablishmentsList({
  q,
  categorie,
  neighborhood,
  minRating,
  sort,
  page,
}: {
  q?: string;
  categorie?: string;
  neighborhood?: string;
  minRating?: string;
  sort?: string;
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
    if (categorie && categorie !== 'all') {
      params.categorie = categorie;
    }
    // Ajouter le tri
    if (sort === 'recent') {
      params.ordering = '-date_creation'; // ou '-created_at' selon ton API
    }

    if (neighborhood) {
      params.quartier = neighborhood;
    }

    if (minRating) {
      params.note_min = parseFloat(minRating);
    }

    // Toujours utiliser getAll qui supporte tous les paramètres
    const response = await cachedEstablishmentService.getAll(params) as any;

    const establishments: TransformedEstablishment[] = response.results.map(transformEstablishmentList);

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
    categorie?: string;
    neighborhood?: string;
    minRating?: string;
    sort?: string;
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
            {params.q 
              ? `Résultats de recherche pour "${params.q}"` 
              : 'Découvrez les meilleurs établissements de Brazzaville'
            }
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <SearchBar initialQuery={params.q} />

        {/* Filtres rapides */}
        <div className="mb-8">
          <FilterChips />
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filtres avancés */}
          <aside className="lg:w-80">
            <AdvancedFilters />
          </aside>

          {/* Grille d'établissements */}
          <div className="flex-1">
            <Suspense
              key={`${params.q}-${params.categorie}-${params.neighborhood}-${params.minRating}-${params.sort}-${page}`}
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <EstablishmentCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <EstablishmentsList 
                q={params.q}
                categorie={params.categorie}
                neighborhood={params.neighborhood}
                minRating={params.minRating}
                sort={params.sort}
                page={page}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}