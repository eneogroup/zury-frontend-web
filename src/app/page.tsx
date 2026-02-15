import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedEstablishments from '@/components/home/FeaturedEstablishments';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import NewEstablishments from '@/components/home/NewEstablishments';
import FadeIn from '@/components/ui/FadeIn';
import { mockEstablishments, mockEvents } from '@/lib/mockData';

export default function Home() {
  // TODO: Remplacer par des appels API réels
  const establishments = mockEstablishments;
  const events = mockEvents;

  return (
    <>
      <Hero />
      <FadeIn delay={0.2}>
        <Categories />
      </FadeIn>
      <FadeIn delay={0.3}>
        <FeaturedEstablishments establishments={establishments} />
      </FadeIn>
      <FadeIn delay={0.4}>
        <UpcomingEvents events={events} />
      </FadeIn>
      <FadeIn delay={0.5}>
        <NewEstablishments establishments={establishments} />
      </FadeIn>
    </>
  );
}