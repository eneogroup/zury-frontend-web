import { Suspense } from 'react';
import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/ui/EventCard';
import EventCardSkeleton from '@/components/ui/EventCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { mockEvents } from '@/lib/mockData';

function EventsList({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  // TODO: Remplacer par un vrai appel API
  // const events = await eventService.getByPeriod(searchParams.period || 'all');
  const events = mockEvents;

  if (events.length === 0) {
    return (
      <EmptyState
        title="Aucun événement trouvé"
        message="Il n'y a pas d'événements prévus pour cette période. Revenez plus tard !"
        icon="empty"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}

export default function EventsPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
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

        {/* Grille d'événements avec loading */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <EventsList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}