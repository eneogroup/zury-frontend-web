import { Suspense } from 'react';
import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/ui/EventCard';
import EventCardSkeleton from '@/components/ui/EventCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Pagination from '@/components/ui/Pagination';
import { eventService } from '@/lib/api';
import { transformEvent } from '@/lib/apiTransformers';

async function EventsList({
  page,
  period,
}: {
  page: number;
  period?: string;
}) {
  try {
    const pageSize = 12;
    
    const response = await eventService.getAll({
      page,
      page_size: pageSize,
      ordering: 'date_debut',
    });

    const events = response.results.map(transformEvent);

    if (events.length === 0) {
      return (
        <EmptyState
          title="Aucun événement trouvé"
          message="Il n'y a pas d'événements prévus pour cette période. Revenez plus tard !"
          icon="empty"
        />
      );
    }

    const totalPages = Math.ceil(response.count / pageSize);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalCount={response.count}
          pageSize={pageSize}
        />
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