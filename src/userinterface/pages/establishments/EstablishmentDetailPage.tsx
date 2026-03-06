import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Phone, Clock, Calendar, Video, Info, Navigation, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import axios from 'axios'
import { cn } from '../../../service/utils/cn'
import DI from '../../../di/ioc'
import type { IEstablishmentDetailViewModel } from '../../../service/interface/establishment.viewmodel.interface'
import EstablishmentCard from '../shared/ui/EstablishmentCard'
import EventCard from '../shared/ui/EventCard'
import { useOpenStatus } from '../../../service/hooks/useOpenStatus'
import { transformEvent, transformEstablishment } from '../../../service/utils/apiTransformers'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://zury-backend-production.up.railway.app'

type TabType = 'tout' | 'apropos' | 'photos' | 'videos' | 'evenements'

export const EstablishmentDetailPage = () => {
  const { currentEstablishment: est, similarEstablishments, detailStatus } =
    DI.resolve<IEstablishmentDetailViewModel>('establishmentDetailViewModel')
  const [activeTab, setActiveTab] = useState<TabType>('tout')
  const [estEvents, setEstEvents] = useState<any[]>([])
  const [estEventsLoading, setEstEventsLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [similaires, setSimilaires] = useState<any[]>([])
  const [similairesLoading, setSimilairesLoading] = useState(true)
  const { status: openStatus } = useOpenStatus(est?.id ?? '', !!est?.id)

  const images: string[] = est?.images && est.images.length > 0
    ? est.images
    : est?.imageUrl ? [est.imageUrl] : []

  useEffect(() => {
    if (lightboxIndex === null) return
    const len = images.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % len : null)
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => i !== null ? (i - 1 + len) % len : null)
      if (e.key === 'Escape')     setLightboxIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, images.length])

  useEffect(() => {
    if (!est?.id) return
    axios
      .get(`${BASE_URL}/api/v1/etablissements/${est.id}/similaires/`, { params: { limit: 8 } })
      .then((res) => {
        const raw = res.data
        const list: any[] = raw?.similaires ?? raw?.data ?? raw?.results ?? (Array.isArray(raw) ? raw : [])
        setSimilaires(list.slice(0, 8).map(transformEstablishment))
      })
      .catch(() => setSimilaires([]))
      .finally(() => setSimilairesLoading(false))
  }, [est?.id])

  useEffect(() => {
    if (activeTab !== 'evenements' || !est?.id) return
    setEstEventsLoading(true)
    axios
      .get(`${BASE_URL}/api/v1/events/`, { params: { etablissement_id: est.id, page_size: 20 } })
      .then((res) => {
        const data = res.data?.data ?? res.data
        const results = (data.results || []).map(transformEvent)
        setEstEvents(results)
      })
      .catch(() => setEstEvents([]))
      .finally(() => setEstEventsLoading(false))
  }, [activeTab, est?.id])

  const tabs: { id: TabType; label: string }[] = [
    { id: 'tout', label: 'Tout' },
    { id: 'apropos', label: 'À propos' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Vidéos' },
    { id: 'evenements', label: 'Événements' },
  ]

  if (detailStatus === 'loading') {
    return (
      <div className="min-h-screen bg-light">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200" />
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl -mt-20">
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!est) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Établissement introuvable</h2>
          <p className="text-gray-500 mb-4">Cet établissement n'existe pas ou a été supprimé.</p>
          <Link to="/explorer" className="text-primary hover:underline font-medium">
            Retour à l'explorateur
          </Link>
        </div>
      </div>
    )
  }

  const coverImage = images.length > 0 ? images[images.length - 1] : null

  const handleDirections = () => {
    if (est.latitude && est.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${est.latitude},${est.longitude}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Breadcrumb bar */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link to="/explorer" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative h-96 w-full bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={est.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark to-dark/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header card */}
        <div className="relative -mt-20 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg overflow-hidden">
                    {images[0] ? (
                      <img src={images[0]} alt={est.name} className="w-full h-full object-cover rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      est.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-dark mb-1">{est.name}</h1>
                    <p className="text-gray-400 text-sm mb-2">{est.reviewCount?.toLocaleString()} vues</p>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase">
                        {est.category}
                      </span>
                      {openStatus !== 'unknown' && (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                          openStatus === 'open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${openStatus === 'open' ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                          {openStatus === 'open' ? 'Ouvert maintenant' : 'Fermé'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{est.address}, {est.neighborhood}</span>
                  </div>
                  {est.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{est.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {est.phone && (
                  <a href={`tel:${est.phone}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('px-6 py-3 font-semibold transition-all whitespace-nowrap relative',
                  activeTab === tab.id ? 'text-primary' : 'text-gray-600 hover:bg-gray-50'
                )}>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="pb-12">
          {activeTab === 'tout' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-dark text-lg mb-4">Détails</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-gold" />
                      <div>
                        <p className="text-sm text-gray-500">Note</p>
                        <p className="font-semibold text-dark">{est.rating}/5 · {est.reviewCount} avis</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Horaires</p>
                        <p className="font-semibold text-dark">{est.hours || 'Lun-Sam: 08h-23h'}</p>
                        {est.isOpen !== undefined && (
                          <p className={`text-sm font-semibold ${est.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                            {est.isOpen ? 'Ouvert' : 'Fermé'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Catégorie</p>
                        <p className="font-semibold text-dark capitalize">{est.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-dark text-lg mb-4">Coordonnées</h3>
                  <div className="space-y-3">
                    {est.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="text-dark">{est.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-dark">{est.address}</p>
                        <p className="text-gray-500 text-sm">{est.neighborhood}</p>
                      </div>
                    </div>
                  </div>
                  {est.latitude && est.longitude && (
                    <button onClick={handleDirections}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-dark hover:border-primary hover:text-primary transition-colors font-medium text-sm">
                      <Navigation className="w-4 h-4" />
                      Itinéraire
                    </button>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-dark text-lg">Photos</h3>
                      <button onClick={() => setActiveTab('photos')} className="text-primary text-sm font-medium hover:underline">
                        Voir tout
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {images.slice(0, 3).map((img, i) => (
                        <div key={i} onClick={() => setLightboxIndex(i)} className="relative h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer">
                          <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-dark text-lg mb-4">À propos</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {est.description ||
                      `Bienvenue chez ${est.name}, votre destination pour une expérience exceptionnelle à ${est.neighborhood}.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apropos' && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-dark mb-6">À propos de {est.name}</h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {est.description ||
                    `Bienvenue chez ${est.name}, votre destination pour une expérience exceptionnelle à ${est.neighborhood}.`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Adresse</h3>
                    <p className="text-gray-600">{est.address}</p>
                    <p className="text-gray-600">{est.neighborhood}, Brazzaville</p>
                  </div>
                  {est.phone && (
                    <div>
                      <h3 className="font-semibold text-dark mb-2">Téléphone</h3>
                      <p className="text-gray-600">{est.phone}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Horaires</h3>
                    <p className="text-gray-600">{est.hours || 'Lun-Sam: 08h-23h · Dim: 10h-22h'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Note</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-gold text-gold" />
                      <span className="text-dark font-semibold">{est.rating}/5</span>
                      <span className="text-gray-500">({est.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Photos</h2>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative h-64 rounded-xl overflow-hidden bg-gray-100 cursor-pointer group">
                      <img src={img} alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <p className="text-gray-500">Aucune photo disponible.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">Aucune vidéo disponible</h3>
              <p className="text-gray-500">Les vidéos seront bientôt disponibles.</p>
            </div>
          )}

          {activeTab === 'evenements' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Événements à {est.name}</h2>
              {estEventsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : estEvents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-dark mb-2">Aucun événement</h3>
                  <p className="text-gray-500">Aucun événement prévu pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {estEvents.map((ev, i) => (
                    <EventCard key={ev.id} event={ev} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Photo Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tabular-nums">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Prev */}
            {images.length > 1 && (
              <button
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : null) }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              src={images[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-w-[88vw] max-h-[88vh] object-contain rounded-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            {images.length > 1 && (
              <button
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i + 1) % images.length : null) }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Similar establishments */}
      {(similairesLoading || similaires.length > 0) && (
        <div className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-dark mb-8">Établissements similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similairesLoading
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                : similaires.map((e, i) => (
                    <EstablishmentCard key={e.id} establishment={e} index={i} />
                  ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
