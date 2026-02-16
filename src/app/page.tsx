import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedEstablishments from '@/components/home/FeaturedEstablishments';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import NewEstablishments from '@/components/home/NewEstablishments';
import FadeIn from '@/components/ui/FadeIn';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { establishmentService, eventService } from '@/lib/api';
import { transformEstablishmentList, transformEvent } from '@/lib/apiTransformers';
import { mockEstablishments, mockEvents } from '@/lib/mockData';

export default async function Home() {
  let featuredEstablishments = [];
  let events = [];
  let hasError = false;

  try {
    // Récupérer les établissements featured
    const featuredResponse = await establishmentService.getFeatured({ page_size: 6 });
    
    console.log('Featured Response:', JSON.stringify(featuredResponse, null, 2));
    
    if (featuredResponse && featuredResponse.results && Array.isArray(featuredResponse.results)) {
      featuredEstablishments = featuredResponse.results.map(transformEstablishmentList);
    } else {
      console.error('Featured response format incorrect:', featuredResponse);
      throw new Error('Format de réponse invalide');
    }

    // Récupérer tous les événements
    const eventsResponse = await eventService.getAll({ page_size: 10, ordering: 'date_debut' });
    
    console.log('Events Response:', JSON.stringify(eventsResponse, null, 2));
    
    if (eventsResponse && eventsResponse.results && Array.isArray(eventsResponse.results)) {
      events = eventsResponse.results.map(transformEvent);
    } else {
      console.error('Events response format incorrect:', eventsResponse);
      throw new Error('Format de réponse invalide');
    }

  } catch (error) {
    console.error('Error loading home page:', error);
    hasError = true;
    
    // Fallback sur les données mock en cas d'erreur
    console.log('Using mock data as fallback');
    featuredEstablishments = mockEstablishments.map(est => ({
      id: est.id,
      name: est.name,
      category: est.category,
      address: est.address,
      neighborhood: est.neighborhood,
      rating: est.rating,
      reviewCount: est.reviewCount,
      imageUrl: est.imageUrl,
      latitude: est.latitude,
      longitude: est.longitude,
      isPremium: est.isPremium,
    }));

    events = mockEvents.map(evt => ({
      id: evt.id,
      title: evt.title,
      category: evt.category,
      date: evt.date,
      time: evt.time,
      establishment: evt.establishment,
      establishmentId: evt.establishmentId,
      price: evt.price,
      availablePlaces: evt.availablePlaces,
      totalPlaces: evt.totalPlaces,
      imageUrl: evt.imageUrl,
      description: evt.description,
    }));
  }

  return (
    <>
      {hasError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-yellow-700">
              ⚠️ Mode hors ligne - Affichage des données de démonstration
            </p>
          </div>
        </div>
      )}
      
      <Hero />
      <FadeIn delay={0.2}>
        <Categories />
      </FadeIn>
      <FadeIn delay={0.3}>
        <FeaturedEstablishments establishments={featuredEstablishments.slice(0, 3)} />
      </FadeIn>
      <FadeIn delay={0.4}>
        <UpcomingEvents events={events.slice(0, 3)} />
      </FadeIn>
      <FadeIn delay={0.5}>
        <NewEstablishments establishments={featuredEstablishments.slice(3, 6)} />
      </FadeIn>
    </>
  );
}