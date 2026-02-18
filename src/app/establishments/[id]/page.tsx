import { notFound } from 'next/navigation';
import { cachedEstablishmentService, cachedEventService } from '@/lib/cached-api';
import { transformEstablishmentDetail, transformEvent } from '@/lib/apiTransformers';
import EstablishmentDetailTabs from '@/components/establishments/EstablishmentDetailTabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TrackView from '@/components/tracking/TrackView';

export default async function EstablishmentDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  try {
    const establishmentData = await cachedEstablishmentService.getById(id);
    const establishment = transformEstablishmentDetail(establishmentData);

    // Essayer de récupérer le statut d'ouverture
    try {
      const statusData = await cachedEstablishmentService.getOpenStatus(id) as { est_ouvert: boolean };
      establishment.isOpen = statusData.est_ouvert || false;
    } catch (error) {
      // Utiliser le champ est_ouvert de l'établissement si disponible
      const estData = establishmentData as { est_ouvert?: boolean };
      establishment.isOpen = estData.est_ouvert || false;
      console.log('Open status endpoint not available, using default');
    }

    // Récupérer les événements
    let events: any[] = [];
    try {
      const eventsResponse = await cachedEventService.getAll({ 
        etablissement_id: id,
        a_venir: true,
        page_size: 10 
      }) as { results?: any[] } | any[];
      
      const eventsList = Array.isArray(eventsResponse) 
        ? eventsResponse 
        : (eventsResponse.results || []);
      
      events = eventsList.map(transformEvent);
    } catch (error) {
      console.log('No events for this establishment');
    }

    const images = establishment.images && establishment.images.length > 0
      ? establishment.images
      : [establishment.imageUrl];

    return (
      <>
        <TrackView establishmentId={id} source="direct" />

        <div className="min-h-screen bg-light">
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

          <EstablishmentDetailTabs 
            establishment={establishment}
            images={images}
            events={events}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading establishment:', error);
    notFound();
  }
}