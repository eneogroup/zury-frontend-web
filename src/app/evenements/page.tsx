import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/ui/EventCard';
import { mockEvents } from '@/lib/mockData';

export default function EventsPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  // TODO: Remplacer par un vrai appel API
  // const events = await eventService.getByPeriod(searchParams.period || 'all');

  const events = mockEvents;

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Événements à Brazzaville</h1>
          <p className="text-gray">
            {events.length} événement{events.length > 1 ? 's' : ''} à venir cette semaine
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-8">
          <EventFilters />
        </div>

        {/* Grille d'événements */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray text-lg">Aucun événement trouvé pour cette période</p>
          </div>
        )}
      </div>
    </div>
  );
}