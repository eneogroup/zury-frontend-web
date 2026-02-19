import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedEstablishments from '@/components/home/FeaturedEstablishments';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import NewEstablishments from '@/components/home/NewEstablishments';
import FadeIn from '@/components/ui/FadeIn';
import { cachedEstablishmentService, cachedEventService, cachedStatsService } from '@/lib/cached-api';
import { transformEstablishmentList, transformEvent } from '@/lib/apiTransformers';
import JoinZuryCTA from '@/components/home/JoinZuryCTA';
import { generateSiteMetadata } from '@/lib/metadata';
import { Metadata, Viewport } from 'next';
export const revalidate = 300;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = generateSiteMetadata({
  title: 'Accueil',
  description: 'Découvrez les meilleurs restaurants, bars, hôtels et événements à Brazzaville et Pointe-Noire. La plateforme HoReCa de référence au Congo.',
  keywords: [
    'restaurants Brazzaville',
    'bars Brazzaville',
    'hôtels Brazzaville',
    'événements Brazzaville',
    'sorties Congo',
    'zury Congo',
  ],
});

export default async function Home() {
  let featuredEstablishments = [];
  let events = [];
  let stats = null;

  try {
    // Essayer de récupérer les stats (peut échouer)
    try {
      stats = await cachedStatsService.getGlobalStats();
    } catch (error) {
      console.error('Stats not available:', error);
      // Créer des stats par défaut
      stats = {
        etablissements: { total: 50, featured: 6 },
        events: { total_a_venir: 10, cette_semaine: 3 },
        utilisateurs: { total_installations: 1200 }
      };
    }
    
    // Récupérer les établissements featured
    const featuredResponse = await cachedEstablishmentService.getFeatured();
    featuredEstablishments = featuredResponse.results.map(transformEstablishmentList);

    // Récupérer les événements à venir
    const eventsResponse = await cachedEventService.getUpcoming();
    const eventsList = eventsResponse.results || eventsResponse;
    events = eventsList.map(transformEvent);

  } catch (error) {
    console.error('Error loading home page:', error);
  }

  return (
    <>
      
      <FadeIn delay={0.3}>
          <Hero stats={stats} />
      </FadeIn>
      <div className="bg-light">
        <FadeIn delay={0.5}>
          <Categories />
        </FadeIn>
        <FadeIn delay={0.5}>
          <FeaturedEstablishments establishments={featuredEstablishments.slice(0, 3)} />
        </FadeIn>
        <FadeIn delay={0.5}>
          <UpcomingEvents events={events.slice(0, 3)} />
        </FadeIn>
        <FadeIn delay={0.5}>
          <NewEstablishments />
        </FadeIn>
        <FadeIn delay={0.5}>
          <JoinZuryCTA />
        </FadeIn>
      </div>
    </>
  );
}