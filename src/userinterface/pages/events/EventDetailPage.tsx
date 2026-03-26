import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket, ExternalLink, X } from 'lucide-react'
import { motion } from 'framer-motion'
import DI from '../../../di/ioc'
import type { IEventDetailViewModel } from '../../../service/interface/events.viewmodel.interface'

export const EventDetailPage = () => {
  const { currentEvent: event, detailStatus } =
    DI.resolve<IEventDetailViewModel>('eventDetailViewModel')
  const [flyerOpen, setFlyerOpen] = useState(false)

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (detailStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-72 md:h-96 bg-gray-200 animate-pulse w-full" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded-xl w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-xl w-1/2 animate-pulse" />
              <div className="h-40 bg-gray-200 rounded-2xl animate-pulse mt-6" />
            </div>
            <div className="lg:w-72 h-64 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  /* ── Not found ───────────────────────────────────────────────────────── */
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-7 h-7 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">Événement introuvable</h2>
          <p className="text-gray-400 text-sm mb-5">Cet événement n'existe pas ou a été supprimé.</p>
          <Link
            to="/evenements"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux événements
          </Link>
        </div>
      </div>
    )
  }

  const totalPlaces     = event.totalPlaces ?? 0
  const availablePlaces = event.availablePlaces ?? 0
  const usedPct         = totalPlaces > 0 ? Math.min(((totalPlaces - availablePlaces) / totalPlaces) * 100, 100) : 0
  const almostFull      = totalPlaces > 0 && availablePlaces > 0 && availablePlaces / totalPlaces < 0.25
  const isComplete      = event.isComplete || (totalPlaces > 0 && availablePlaces === 0)

  /* ── Page ────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero image ──────────────────────────────────────────────────── */}
      <div className="relative h-72 md:h-[420px] w-full bg-gray-900 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark/80 to-primary/40" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Back button */}
        <div className="absolute top-5 left-0 w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/evenements"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Événements
            </Link>
          </div>
        </div>

        {/* Title overlay — bottom of hero */}
        <div className="absolute bottom-0 left-0 w-full pb-7 pt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-white px-2.5 py-1 rounded-full">
                  {event.category}
                </span>
                {event.price === 'Gratuit' && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-green-500 text-white px-2.5 py-1 rounded-full">
                    Gratuit
                  </span>
                )}
                {isComplete && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500 text-white px-2.5 py-1 rounded-full">
                    Complet
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
                {event.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left — description & details ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                {event.adressePropre || event.lieuPersonnalise || event.establishment || 'Lieu non renseigné'}
              </span>
            </div>

            {/* Description */}
            {event.description ? (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">
                  À propos
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {event.description}
                </p>
              </div>
            ) : (
              <div className="mb-6 py-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Aucune description disponible.</p>
              </div>
            )}

            {/* Establishment link */}
            {event.establishmentId && (
              <Link
                to={`/establishments/${event.establishmentId}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-xl transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Voir l'établissement
              </Link>
            )}
          </motion.div>

          {/* ── Right — sticky info card ───────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:w-72 flex-shrink-0 self-start lg:sticky lg:top-6 space-y-4"
          >
            {/* Flyer card */}
            {event.imageUrl && (
              <div
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in"
                onClick={() => setFlyerOpen(true)}
              >
                <img
                  src={event.imageUrl}
                  alt={`Flyer — ${event.title}`}
                  className="w-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Price */}
              <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1 flex items-center gap-1.5">
                  <Ticket className="w-3 h-3" /> Tarif
                </p>
                <p className={`text-3xl font-display font-bold ${event.price === 'Gratuit' ? 'text-green-500' : 'text-primary'}`}>
                  {event.price}
                </p>
              </div>

              {/* Date & time */}
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Date & heure
                </p>
                <p className="text-sm font-semibold text-dark">{event.date}</p>
                <p className="text-sm text-gray-500 mt-0.5">{event.time}</p>
              </div>

              {/* Location */}
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Lieu
                </p>
                <p className="text-sm font-semibold text-dark leading-snug">
                  {event.adressePropre || event.lieuPersonnalise || event.establishment || 'Lieu non renseigné'}
                </p>
              </div>

              {/* Capacity */}
              {totalPlaces > 0 && (
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2 flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Places
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-semibold ${isComplete ? 'text-red-500' : almostFull ? 'text-orange-500' : 'text-dark'}`}>
                      {isComplete
                        ? 'Complet'
                        : almostFull
                          ? `${availablePlaces} place${availablePlaces > 1 ? 's' : ''} restante${availablePlaces > 1 ? 's' : ''}`
                          : `${availablePlaces} / ${totalPlaces} disponibles`}
                    </p>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isComplete ? 'bg-red-400' : almostFull ? 'bg-orange-400' : 'bg-primary'
                      }`}
                      style={{ width: `${usedPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="p-5">
                <button
                  onClick={() => {
                    const phoneNumber = event.telephone ? event.telephone.replace(/\D/g, '') : ''
                    if (!isComplete && phoneNumber) {
                      const message = encodeURIComponent(`Bonjour, j'ai vu votre événement sur Zury et je souhaite réserver des places pour l'événement "${event.title}".`)
                      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
                    } else if (!isComplete && !phoneNumber) {
                      alert("Aucun numéro de réservation n'est disponible pour cet événement.")
                    }
                  }}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    isComplete
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-primary/20'
                  }`}
                >
                  {!isComplete && <Ticket className="w-4 h-4" />}
                  {isComplete ? 'Événement complet' : 'Réserver maintenant'}
                </button>
              </div>
            </div>
          </motion.aside>

        </div>
      </div>

      {/* ── Flyer lightbox ── */}
      <AnimatePresence>
        {flyerOpen && event.imageUrl && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFlyerOpen(false)}
          >
            <button
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setFlyerOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              src={event.imageUrl}
              alt={event.title}
              className="max-w-[88vw] max-h-[88vh] object-contain rounded-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
