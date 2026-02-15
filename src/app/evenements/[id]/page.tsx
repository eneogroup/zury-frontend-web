import { notFound } from 'next/navigation';
import { mockEvents, mockEstablishments } from '@/lib/mockData';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket } from 'lucide-react';
import Link from 'next/link';

export default async function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // TODO: Remplacer par un vrai appel API
  // const event = await eventService.getById(params.id);
  
  const { id } = await params;
  
  const event = mockEvents.find((evt) => evt.id === id);

  if (!event) {
    notFound();
  }

  // Trouver l'établissement associé
  const establishment = mockEstablishments.find(
    (est) => est.name === event.establishment
  );

  return (
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
            {/* Titre */}
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
                  {establishment && (
                    <Link 
                      href={`/establishments/${establishment.id}`}
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
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(event.availablePlaces / event.totalPlaces) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-dark mb-4">À propos de l'événement</h2>
              <p className="text-gray leading-relaxed">
                Rejoignez-nous pour une soirée exceptionnelle ! {event.title} vous 
                promet une expérience inoubliable dans le cadre unique de {event.establishment}. 
                Réservez vite votre place, les places sont limitées !
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <Button variant="primary" size="lg" className="flex-1">
                Réserver maintenant
              </Button>
              <Button variant="outline" size="lg">
                Partager
              </Button>
            </div>
          </div>
        </div>

        {/* Carte de localisation (optionnel) */}
        {establishment?.latitude && establishment?.longitude && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-dark mb-4">Localisation</h2>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray">Carte Google Maps (à intégrer)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}