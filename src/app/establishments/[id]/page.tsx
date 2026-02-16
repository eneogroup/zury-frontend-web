import { notFound } from 'next/navigation';
import { establishmentService, eventService } from '@/lib/api';
import { transformEstablishmentDetail, transformEvent } from '@/lib/apiTransformers';
import ImageGallery from '@/components/establishments/ImageGallery';
import EstablishmentHeader from '@/components/establishments/EstablishmentHeader';
import EstablishmentInfo from '@/components/establishments/EstablishmentInfo';
import EstablishmentEvents from '@/components/establishments/EstablishmentEvents';
import ContactCard from '@/components/establishments/ContactCard';
import ScheduleCard from '@/components/establishments/ScheduleCard';
import LocationCard from '@/components/establishments/LocationCard';
import ReviewsSection from '@/components/establishments/ReviewsSection';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EstablishmentDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  try {
    // Récupérer les détails de l'établissement
    const establishmentData = await establishmentService.getById(id);
    const establishment = transformEstablishmentDetail(establishmentData);

    // Récupérer les événements de cet établissement
    const eventsResponse = await eventService.getAll({ 
      etablissement_id: id,
      page_size: 10 
    });
    const events = eventsResponse.results.map(transformEvent);

    // Créer la galerie d'images
    const images = establishment.images && establishment.images.length > 0
      ? establishment.images
      : [establishment.imageUrl, establishment.imageUrl, establishment.imageUrl];

    return (
      <div className="min-h-screen bg-light">
        {/* Header fixe */}
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

        {/* Galerie */}
        <ImageGallery images={images} name={establishment.name} />

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <EstablishmentHeader establishment={establishment} />
              <EstablishmentInfo establishment={establishment} />
              
              {events.length > 0 && (
                <EstablishmentEvents events={events} />
              )}

              <ReviewsSection 
                rating={establishment.rating}
                reviewCount={establishment.reviewCount}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ContactCard establishment={establishment} />
              <ScheduleCard />
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
  } catch (error) {
    console.error('Error loading establishment:', error);
    
    // Vérifier si c'est une 404
    if (error instanceof Error && error.message.includes('404')) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-light py-20">
        <ErrorMessage
          title="Erreur de chargement"
          message="Impossible de charger les détails de l'établissement."
        />
      </div>
    );
  }
}