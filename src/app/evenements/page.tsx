import { Suspense } from 'react';
import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/ui/EventCard';
import EventCardSkeleton from '@/components/ui/EventCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { cachedEventService } from '@/lib/cached-api';
import { transformEvent } from '@/lib/apiTransformers';
import type { TransformedEvent } from '@/types';

async function EventsList({
  page,
  period,
}: {
  page: number;
  period?: string;
}) {
  try {
    const pageSize = 12;
    
    let response;

    // Filtrer selon la période
    switch (period) {
      case 'today':
        response = await cachedEventService.getToday();
        break;
      case 'weekend':
        response = await cachedEventService.getThisWeekend();
        break;
      case 'week':
      case 'month':
      case 'all':
      default:
        response = await cachedEventService.getUpcoming();
        break;
    }

    let events: TransformedEvent[] = response.results ? response.results.map(transformEvent) : response.map(transformEvent);

    if (events.length === 0) {
      return (
        <EmptyState
          title="Aucun événement trouvé"
          message="Il n'y a pas d'événements prévus pour cette période. Revenez plus tard !"
          icon="empty"
        />
      );
    }

    // Pagination manuelle pour les endpoints qui ne retournent pas de pagination
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
      <EmptyState
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
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  return (
    <div className="min-h-screen bg-light">
      {/* Header de la page */}
      <div className="bg-gradient-to-r from-dark to-dark/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Événements à Brazzaville</h1>
          <p className="text-white/80 text-lg">
            Découvrez les meilleurs événements de la ville
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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