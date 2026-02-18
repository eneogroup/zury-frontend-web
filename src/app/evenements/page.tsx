import { Suspense } from 'react';
import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/ui/EventCard';
import EventCardSkeleton from '@/components/ui/EventCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { cachedEventService } from '@/lib/cached-api';
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
    
    let response;

    // Appeler l'endpoint approprié selon la période
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

    // Gérer les différents formats de réponse
    let allEvents: any[] = [];

    if (Array.isArray(response)) {
      allEvents = response;
    } else if (response && response.results && Array.isArray(response.results)) {
      allEvents = response.results;
    } else if (response && typeof response === 'object') {
      // Si c'est un objet avec des clés, essayer de l'extraire
      console.warn('Format de réponse inattendu:', response);
      allEvents = [];
    }

    // Transformer les événements
    const transformedEvents = allEvents
      .map((event) => {
        try {
          return transformEvent(event);
        } catch (error) {
          console.error('Erreur lors de la transformation d\'un événement:', error);
          return null;
        }
      })
      .filter(Boolean); // Enlever les événements null

    // Filtrer selon la période (côté client en attendant que le backend corrige)
    let events = transformedEvents;

    // Vérifier si les événements sont vides
    if (events.length === 0) {
      let message = "Il n'y a pas d'événements prévus pour le moment. Revenez plus tard !";
      
      if (period === 'today') {
        message = "Aucun événement prévu aujourd'hui. Consultez les événements à venir !";
      } else if (period === 'weekend') {
        message = "Aucun événement prévu ce weekend. Consultez les autres périodes !";
      } else if (period === 'week') {
        message = "Aucun événement prévu cette semaine. Consultez les événements du mois !";
      } else if (period === 'month') {
        message = "Aucun événement prévu ce mois-ci. Consultez tous les événements !";
      }
      
      return (
        <EmptyState
          title="Aucun événement trouvé"
          message={message}
        />
      );
    }

    // Pagination côté client
    const totalCount = events.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Valider la page actuelle
    const currentPage = page < 1 ? 1 : page > totalPages ? totalPages : page;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = events.slice(startIndex, endIndex);

    // Vérifier que les événements paginés existent
    if (paginatedEvents.length === 0 && currentPage > 1) {
      // Si on est sur une page vide, rediriger vers la dernière page valide
      return (
        <div className="text-center py-12">
          <p className="text-gray mb-4">Cette page n'existe pas.</p>
          <a href={`/evenements?${period ? `period=${period}&` : ''}page=${totalPages}`} className="text-primary hover:underline">
            Retour à la dernière page
          </a>
        </div>
      );
    }

    return (
      <>
        {/* Résumé */}
        <div className="mb-6 text-gray">
          {totalCount > 0 && (
            <p>
              Affichage de {startIndex + 1} à {Math.min(endIndex, totalCount)} sur {totalCount} événement{totalCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Grille d'événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedEvents.map((event, index) => (
            <EventCard key={event.id || index} event={event} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
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
        message="Impossible de charger les événements. Vérifiez votre connexion et réessayez."
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
  const page = params.page ? parseInt(params.page, 10) : 1;
  const period = params.period;

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
          key={`${period}-${page}`}
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <EventsList page={page} period={period} />
        </Suspense>
      </div>
    </div>
  );
}