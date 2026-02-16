import { Suspense } from 'react';
import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/ui/EventCard';
import EventCardSkeleton from '@/components/ui/EventCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { eventService } from '@/lib/api';
import { transformEvent } from '@/lib/apiTransformers';

async function EventsList({
  searchParams,
}: {
  searchParams: { period?: string; page?: string };
}) {
  try {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    
    const response = await eventService.getAll({
      page,
      page_size: 12,
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

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
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

export default function EventsPage({
  searchParams,
}: {
  searchParams: { period?: string; page?: string };
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
          <EventsList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}