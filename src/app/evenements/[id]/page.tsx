import { notFound } from 'next/navigation';
import { cachedEventService } from '@/lib/cached-api';
import { transformEvent } from '@/lib/apiTransformers';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import TrackView from '@/components/tracking/TrackView';
import ShareButton from '@/components/ui/ShareButton';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { generateSiteMetadata } from '@/lib/metadata';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const eventData = await cachedEventService.getById(id);
    const event = transformEvent(eventData);
    
    const title = event.title;
    const description = event.description 
      ? event.description.slice(0, 160) 
      : `${event.title} - ${event.category} le ${new Date(event.dateDebut).toLocaleDateString('fr-FR')} à ${event.availablePlaces || 'Brazzaville'}.`;
    
    const ogImage = event.imageUrl || undefined;
    
    return generateSiteMetadata({
      title,
      description,
      ogImage,
      ogType: 'article',
      keywords: [
        event.title,
        event.category,
        'événement Brazzaville',
        event.availablePlaces || 'Brazzaville',
        'sortie Congo',
      ],
    });
  } catch (error) {
    return generateSiteMetadata({
      title: 'Événement introuvable',
      noIndex: true,
    });
  }
}


export default async function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  try {
    const eventData = await cachedEventService.getById(id);
    const event = transformEvent(eventData);

    return (
      <>
        {/* Tracking */}
        <TrackView eventId={id} source="direct" />

        <div className="min-h-screen bg-light py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bouton retour */}
            <Link 
              href="/evenements"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux événements
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Image de couverture */}
              <div className="relative h-80 w-full">
                <ImageWithFallback
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="premium">{event.category}</Badge>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-dark mb-6">{event.title}</h1>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Date et heure */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-dark">Date et heure</p>
                      <p className="text-gray">{event.date}</p>
                      <p className="text-gray flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </p>
                    </div>
                  </div>

                  {/* Lieu */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-dark">Lieu</p>
                      <p className="text-gray">{event.establishment}</p>
                      {event.establishmentId && (
                        <Link 
                          href={`/establishments/${event.establishmentId}`}
                          className="text-primary hover:underline text-sm"
                        >
                          Voir l'établissement →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="flex items-start gap-3">
                    <Ticket className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-dark">Tarif</p>
                      <p className="text-2xl font-bold text-primary">{event.price}</p>
                    </div>
                  </div>

                  {/* Places disponibles */}
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-dark">Places disponibles</p>
                      <p className="text-gray">
                        {event.availablePlaces} / {event.totalPlaces} places
                      </p>
                      {event.totalPlaces > 0 && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{ 
                              width: `${(event.availablePlaces / event.totalPlaces) * 100}%` 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-dark mb-4">À propos de l'événement</h2>
                    <p className="text-gray leading-relaxed">{event.description}</p>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex gap-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="flex-1"
                    disabled={event.isComplete}
                  >
                    {event.isComplete ? 'Complet' : 'Réserver maintenant'}
                  </Button>
                  <ShareButton eventId={id} variant="outline" size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
}