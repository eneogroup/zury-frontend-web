import { notFound } from 'next/navigation';
import { mockEstablishments, mockEvents } from '@/lib/mockData';
import ImageGallery from '@/components/establishments/ImageGallery';
import EstablishmentHeader from '@/components/establishments/EstablishmentHeader';
import EstablishmentInfo from '@/components/establishments/EstablishmentInfo';
import EstablishmentEvents from '@/components/establishments/EstablishmentEvents';
import ContactCard from '@/components/establishments/ContactCard';
import ScheduleCard from '@/components/establishments/ScheduleCard';
import LocationCard from '@/components/establishments/LocationCard';
import ReviewsSection from '@/components/establishments/ReviewsSection';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EstablishmentDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const establishment = mockEstablishments.find((est) => est.id === id);

  if (!establishment) {
    notFound();
  }

  // Simuler plusieurs images pour la galerie
  const images = [
    establishment.imageUrl,
    establishment.imageUrl,
    establishment.imageUrl,
    establishment.imageUrl,
  ];

  // Trouver les événements de cet établissement
  const establishmentEvents = mockEvents.filter(
    (event) => event.establishment === establishment.name
  );

  return (
    <div className="min-h-screen bg-light">
      {/* Header fixe avec bouton retour */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link 
            href="/explorer"
            className="inline-flex items-center gap-2 text-gray hover:text-primary font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </div>

      {/* Galerie d'images */}
      <ImageGallery images={images} name={establishment.name} />

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale (gauche) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header avec titre et badges */}
            <EstablishmentHeader establishment={establishment} />

            {/* À propos */}
            <EstablishmentInfo establishment={establishment} />

            {/* Événements */}
            {establishmentEvents.length > 0 && (
              <EstablishmentEvents events={establishmentEvents} />
            )}

            {/* Avis */}
            <ReviewsSection 
              rating={establishment.rating}
              reviewCount={establishment.reviewCount}
            />
          </div>

          {/* Sidebar (droite) */}
          <div className="space-y-6">
            {/* Contact et actions */}
            <ContactCard establishment={establishment} />

            {/* Horaires */}
            <ScheduleCard schedule={establishment.schedule} />

            {/* Localisation */}
            <LocationCard 
              address={establishment.address}
              neighborhood={establishment.neighborhood}
              latitude={establishment.latitude}
              longitude={establishment.longitude}
            />
          </div>
        </div>
      </div>
    </div>
  );
}