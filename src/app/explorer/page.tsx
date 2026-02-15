import SearchBar from '@/components/establishments/SearchBar';
import FilterChips from '@/components/establishments/FilterChips';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import { mockEstablishments } from '@/lib/mockData';

export default function ExplorerPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  // TODO: Remplacer par un vrai appel API
  // const establishments = await establishmentService.search(searchParams.q || '', {
  //   category: searchParams.category,
  // });

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

        {/* Résultats */}
        <div className="mb-4">
          <p className="text-gray">
            {establishments.length} résultat{establishments.length > 1 ? 's' : ''} trouvé{establishments.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille d'établissements */}
        {establishments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {establishments.map((establishment) => (
              <EstablishmentCard key={establishment.id} establishment={establishment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray text-lg">Aucun établissement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}