import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket } from 'lucide-react'
import DI from '../../../di/ioc'
import type { IEventDetailViewModel } from '../../../service/interface/events.viewmodel.interface'

export const EventDetailPage = () => {
  const { currentEvent: event, detailStatus } = DI.resolve<IEventDetailViewModel>('eventDetailViewModel')

  if (detailStatus === 'loading') {
    return (
      <div className="min-h-screen bg-light py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-80 bg-gray-200 rounded-xl mb-8" />
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
              <div className="grid grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Événement introuvable</h2>
          <p className="text-gray-500 mb-4">Cet événement n'existe pas ou a été supprimé.</p>
          <Link to="/evenements" className="text-primary hover:underline font-medium">
            Retour aux événements
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/evenements"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux événements
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image de couverture */}
          <div className="relative h-80 w-full bg-gray-100">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-dark/20 flex items-center justify-center">
                <Calendar className="w-24 h-24 text-primary/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-dark mb-6">{event.title}</h1>

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">Date et heure</p>
                  <p className="text-gray-600">{event.date}</p>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">Lieu</p>
                  <p className="text-gray-600">{event.establishment}</p>
                  {event.establishmentId && (
                    <Link
                      to={`/establishments/${event.establishmentId}`}
                      className="text-primary hover:underline text-sm mt-1 block"
                    >
                      Voir l'établissement →
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">Tarif</p>
                  <p className="text-2xl font-bold text-primary">{event.price}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">Places disponibles</p>
                  <p className="text-gray-600">
                    {event.availablePlaces} / {event.totalPlaces} places
                  </p>
                  {event.totalPlaces > 0 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((event.availablePlaces / event.totalPlaces) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-8 p-6 bg-light rounded-xl">
                <h2 className="text-xl font-bold text-dark mb-4">À propos de l'événement</h2>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Bouton d'action */}
            <div className="flex gap-4">
              <a
                href={event.phone ? `tel:${event.phone}` : '#'}
                className={`flex-1 py-4 rounded-xl font-semibold text-center text-lg transition-all ${
                  event.isComplete
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/30'
                }`}
              >
                {event.isComplete ? 'Complet' : 'Réserver maintenant'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
