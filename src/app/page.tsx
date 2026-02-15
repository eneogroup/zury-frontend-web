import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedEstablishments from '@/components/home/FeaturedEstablishments';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import NewEstablishments from '@/components/home/NewEstablishments';
import { mockEstablishments, mockEvents } from '@/lib/mockData';

export default function Home() {
  // TODO: Remplacer par des appels API réels
  // const establishments = await establishmentService.getAll();
  // const events = await eventService.getAll();
  
  const establishments = mockEstablishments;
  const events = mockEvents;

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedEstablishments establishments={establishments} />
      <UpcomingEvents events={events} />
      <NewEstablishments establishments={establishments} />
    </>
  );
}