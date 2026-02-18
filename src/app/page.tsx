import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedEstablishments from '@/components/home/FeaturedEstablishments';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import NewEstablishments from '@/components/home/NewEstablishments';
import FadeIn from '@/components/ui/FadeIn';
import { mockEstablishments, mockEvents } from '@/lib/mockData';

export default function Home() {
  const establishments = mockEstablishments.map(est => ({
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

  const events = mockEvents.map(evt => ({
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

  return (
    <>
      {/* Hero plein écran */}
      <Hero />
      
      {/* Sections avec fond clair */}
      <div className="bg-light">
        <FadeIn delay={0.2}>
          <Categories />
        </FadeIn>
        <FadeIn delay={0.3}>
          <FeaturedEstablishments establishments={establishments.slice(0, 3)} />
        </FadeIn>
        <FadeIn delay={0.4}>
          <UpcomingEvents events={events.slice(0, 3)} />
        </FadeIn>
        <FadeIn delay={0.5}>
          <NewEstablishments establishments={establishments.slice(3, 6)} />
        </FadeIn>
      </div>
    </>
  );
}