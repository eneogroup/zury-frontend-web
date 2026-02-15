import { notFound } from 'next/navigation';
import { mockEstablishments } from '@/lib/mockData';
import ImageGallery from '@/components/establishments/ImageGallery';
import ContactInfo from '@/components/establishments/ContactInfo';
import ScheduleCard from '@/components/establishments/ScheduleCard';
import ReviewsCard from '@/components/establishments/ReviewsCard';
import Badge from '@/components/ui/Badge';
import { Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EstablishmentDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // TODO: Remplacer par un vrai appel API
  // const establishment = await establishmentService.getById(params.id);
  
  const establishment = mockEstablishments.find((est) => est.id === params.id);

  if (!establishment) {
    notFound();
  }

  // Simuler plusieurs images pour la galerie
  const images = [
    establishment.imageUrl,
    establishment.imageUrl,
    establishment.imageUrl,
  ];

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <Link 
          href="/explorer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>

        {/* Galerie */}
        <div className="mb-8">
          <ImageGallery images={images} name={establishment.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-dark mb-2">
                    {establishment.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={establishment.category}>
                      {establishment.category}
                    </Badge>
                    {establishment.isOpen !== undefined && (
                      <Badge variant={establishment.isOpen ? 'open' : 'closed'}>
                        {establishment.isOpen ? 'Ouvert' : 'Fermé'}
                      </Badge>
                    )}
                    {establishment.isPremium && (
                      <Badge variant="premium">Premium</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(establishment.rating)
                          ? 'fill-gold text-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-dark">
                  {establishment.rating}/5
                </span>
                <span className="text-gray">
                  ({establishment.reviewCount} avis)
                </span>
              </div>

              {/* Description */}
              {establishment.description && (
                <div>
                  <h2 className="text-xl font-bold text-dark mb-3">À propos</h2>
                  <p className="text-gray leading-relaxed">
                    {establishment.description}
                  </p>
                </div>
              )}
            </div>

            {/* Avis */}
            <ReviewsCard 
              rating={establishment.rating} 
              reviewCount={establishment.reviewCount} 
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <ContactInfo
              address={establishment.address}
              phone={establishment.phone}
              hours={establishment.hours}
              isOpen={establishment.isOpen}
              latitude={establishment.latitude}
              longitude={establishment.longitude}
            />

            {/* Horaires */}
            <ScheduleCard />
          </div>
        </div>
      </div>
    </div>
  );
}