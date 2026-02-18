import { notFound } from 'next/navigation';
import { mockEstablishments, mockEvents } from '@/lib/mockData';
import EstablishmentDetailTabs from '@/components/establishments/EstablishmentDetailTabs';
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

  // Événements de cet établissement
  const establishmentEvents = mockEvents.filter(
    (event) => event.establishment === establishment.name
  );

  // Simuler plusieurs images
  const images = [
    establishment.imageUrl,
    establishment.imageUrl,
    establishment.imageUrl,
    establishment.imageUrl,
  ];

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

      {/* Composant avec onglets */}
      <EstablishmentDetailTabs 
        establishment={establishment}
        images={images}
        events={establishmentEvents}
      />
    </div>
  );
}