import { Suspense } from 'react';
import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/ui/EventCard';
import EventCardSkeleton from '@/components/ui/EventCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Pagination from '@/components/ui/Pagination';
import { cachedEventService } from '@/lib/cached-api';
import { transformEvent } from '@/lib/apiTransformers';
import { filterEventsByPeriod } from '@/lib/dateFilters';

async function EventsList({
  page,
  period,
}: {
  page: number;
  period?: string;
}) {
  try {
    const pageSize = 12;
    
    // Récupérer tous les événements (on pourrait optimiser avec un page_size plus grand)
    const response = await cachedEventService.getAll({
      page: 1,
      page_size: 100, // Récupérer plus d'événements pour le filtrage côté client
      ordering: 'date_debut',
    });

    let events = response.results.map(transformEvent);

    // Filtrer par période côté client
    events = filterEventsByPeriod(events, period);

    if (events.length === 0) {
      return (
        <EmptyState
          title="Aucun événement trouvé"
          message="Il n'y a pas d'événements prévus pour cette période. Revenez plus tard !"
          icon="empty"
        />
      );
    }

    // Pagination manuelle côté client
    const totalCount = events.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
          />
        )}
      </>
    );
  } catch (error) {
    console.error('Error loading events:', error);
    return (
      <ErrorMessage
        title="Erreur de chargement"
        message="Impossible de charger les événements."
      />
    );
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; page?: string }>;
}) {
  // Unwrap searchParams
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Événements à Brazzaville</h1>
          <p className="text-gray">
            Découvrez les meilleurs événements de la ville
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-8">
          <EventFilters />
        </div>

        {/* Grille d'événements */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <EventsList page={page} period={params.period} />
        </Suspense>
      </div>
    </div>
  );
}