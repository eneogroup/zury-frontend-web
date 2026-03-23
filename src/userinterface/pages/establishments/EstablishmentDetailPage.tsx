import { Star, MapPin, Phone, Clock, Calendar, Video, Info, Navigation, ArrowLeft, ChevronLeft, ChevronRight, X, MessageSquare, Send, Users, ChevronDown, CheckCircle2, Loader2, Utensils, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../../store/store'
import { useAddReviewMutation, useBookTableMutation, useGetMenusQuery, useCreateOrderMutation } from '../../../store/apiSlice'
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../../../store/cartSlice'
import { KeycloakService } from '../../../service/auth/KeycloakService'
import { ChatModal } from '../../components/ChatModal'
import axios from 'axios'
import { cn } from '../../../service/utils/cn'
import DI from '../../../di/ioc'
import type { IEstablishmentDetailViewModel } from '../../../service/interface/establishment.viewmodel.interface'
import EstablishmentCard from '../shared/ui/EstablishmentCard'
import EventCard from '../shared/ui/EventCard'
import SEO from '../shared/ui/SEO'
import { transformEvent, transformEstablishment } from '../../../service/utils/apiTransformers'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://zury-backend-production.up.railway.app'

type TabType = 'tout' | 'apropos' | 'photos' | 'videos' | 'evenements' | 'avis' | 'menu'

export const EstablishmentDetailPage = () => {
  const { currentEstablishment: est, similarEstablishments, detailStatus } =
    DI.resolve<IEstablishmentDetailViewModel>('establishmentDetailViewModel')
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<TabType>('tout')
  const [estEvents, setEstEvents] = useState<any[]>([])
  const [estEventsLoading, setEstEventsLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [similaires, setSimilaires] = useState<any[]>([])
  const [similairesLoading, setSimilairesLoading] = useState(true)
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const cart = useSelector((state: RootState) => state.cart)
  
  const [addReview, { isLoading: isSubmittingReview }] = useAddReviewMutation()
  const [bookTable, { isLoading: isBookingTable }] = useBookTableMutation()
  const { data: menuData, isLoading: isMenuLoading } = useGetMenusQuery(est?.id || '', { skip: !est?.id || activeTab !== 'menu' })
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation()

  const [reviewNote, setReviewNote] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderAddress, setOrderAddress] = useState('')

  const [resData, setResData] = useState({
    date: new Date().toISOString().split('T')[0],
    heure: '19:00',
    nombre_personnes: 2,
    notes: ''
  })

  const openStatus = est?.isOpen === true ? 'open' : est?.isOpen === false ? 'closed' : 'unknown'

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

  const fetchReviews = () => {
    if (!est?.id) return
    setReviewsLoading(true)
    axios
      .get(`${BASE_URL}/api/v1/establishments/${est.id}/reviews/`)
      .then((res) => {
        const raw = res.data?.results ?? res.data ?? []
        setReviews(Array.isArray(raw) ? raw : [])
      })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false))
  }

  useEffect(() => {
    if (activeTab === 'avis') {
      fetchReviews()
    }
  }, [activeTab, est?.id])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!est?.id || !reviewComment.trim()) return
    try {
      await addReview({ id: est.id, note: reviewNote, commentaire: reviewComment }).unwrap()
      setReviewComment('')
      setReviewNote(5)
      fetchReviews() // Reload reviews seamlessly
    } catch (err) {
      console.error('Erreur lors de la soumission de l\'avis', err)
    }
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'tout', label: 'Tout' },
    { id: 'apropos', label: 'À propos' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Vidéos' },
    { id: 'evenements', label: 'Événements' },
    { id: 'menu', label: 'Menu' },
    { id: 'avis', label: 'Avis' },
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
      <SEO 
        title={`${est.name} - Zury Congo`} 
        description={est.description || `Découvrez ${est.name} à ${est.neighborhood}.`}
        image={coverImage || 'https://zury-web.vercel.app/logo.png'}
        url={`https://zury-web.vercel.app/establishments/${est.id}`}
      />
      
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
                    <p className="text-gray-400 text-sm mb-2">{est.viewCount?.toLocaleString()} vues</p>
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
                    className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-200 text-dark rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                )}
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      KeycloakService.login({ redirectUri: window.location.href })
                      return
                    }
                    setReservationModalOpen(true)
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
                >
                  <Calendar className="w-4 h-4" />
                  Réserver une table
                </button>
                <button 
                  onClick={() => setChatModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-dark rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Message
                </button>
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

          {activeTab === 'menu' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-dark">Menu Digital</h2>
                {cart.items.length > 0 && cart.establishmentId === est.id && (
                  <button 
                    onClick={() => setOrderModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/20 animate-bounce-subtle"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Voir le panier ({cart.items.reduce((acc, i) => acc + i.quantity, 0)})
                  </button>
                )}
              </div>

              {isMenuLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4 animate-pulse">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                        <div className="h-3 bg-gray-50 rounded w-full" />
                        <div className="h-4 bg-gray-100 rounded w-1/4 pt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : menuData?.length > 0 ? (
                <div className="space-y-12">
                   {/* Normally group by categories here if available in API, otherwise list all */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuData.map((item: any) => (
                      <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all flex gap-4">
                        <div className="w-24 h-24 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
                           {item.image ? (
                             <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-200">
                               <Utensils className="w-10 h-10" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h4 className="font-bold text-dark">{item.nom}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1 flex-1">{item.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-primary">{item.prix} FCFA</span>
                            <button 
                              onClick={() => {
                                dispatch(addToCart({
                                  id: item.id,
                                  name: item.nom,
                                  price: item.prix,
                                  quantity: 1,
                                  establishmentId: est.id,
                                  establishmentName: est.name
                                }))
                              }}
                              className="p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-lg text-gray-400 transition-all border border-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                   </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                   <Utensils className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                   <p className="text-gray-400 font-medium tracking-wide">Le menu n'est pas encore disponible en ligne.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-dark mb-6">Avis de l'établissement</h2>
              
              {/* Formulaire Authentifié */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit}>
                    <h3 className="text-lg font-bold text-dark mb-4">Laisser votre avis</h3>
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setReviewNote(s)} className="p-1 focus:outline-none transition-transform hover:scale-110">
                          <Star className={`w-8 h-8 ${s <= reviewNote ? 'fill-gold text-gold' : 'text-gray-200'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Partagez votre expérience avec la communauté..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[120px] outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y mb-4"
                    />
                    <div className="flex justify-end">
                      <button disabled={isSubmittingReview || !reviewComment.trim()} type="submit" 
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-full transition-all disabled:opacity-50">
                        {isSubmittingReview ? 'Envoi...' : <>Publier <Send className="w-4 h-4" /></>}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium tracking-wide">Connectez-vous pour laisser un avis.</p>
                  </div>
                )}
              </div>

              {/* Liste des avis */}
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                      <div className="h-16 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {(rev.user?.first_name || 'A')?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-dark text-sm">{rev.user?.first_name || 'Utilisateur'} {rev.user?.last_name}</p>
                            <p className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <span className="text-sm font-bold text-dark">{rev.note}/5</span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">{rev.commentaire}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aucun avis pour le moment.</p>
                  <p className="text-gray-400 text-sm">Soyez le premier à partager votre expérience !</p>
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

      {/* ── Table Reservation Modal ── */}
      <AnimatePresence>
        {reservationModalOpen && (
          <motion.div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-dark">Réserver une table chez {est.name}</h3>
                <button onClick={() => setReservationModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark">Demande envoyée !</h3>
                  <p className="text-gray-500">
                    Votre demande de réservation a été envoyée à l'établissement. Vous recevrez une notification dès qu'elle sera acceptée.
                  </p>
                  <button 
                    onClick={() => {
                      setReservationModalOpen(false)
                      setBookingSuccess(false)
                    }}
                    className="mt-8 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all"
                  >
                    D'accord
                  </button>
                </div>
              ) : (
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Date</label>
                      <input 
                        type="date"
                        value={resData.date}
                        onChange={(e) => setResData({ ...resData, date: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Heure</label>
                      <input 
                        type="time"
                        value={resData.heure}
                        onChange={(e) => setResData({ ...resData, heure: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Nombre de personnes</label>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5, 6, "Plus"].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setResData({ ...resData, nombre_personnes: typeof n === 'number' ? n : 8 })}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-semibold transition-all border",
                            (resData.nombre_personnes === n || (n === "Plus" && resData.nombre_personnes >= 8))
                              ? "bg-primary border-primary text-white"
                              : "bg-gray-50 border-gray-100 text-gray-600 hover:border-primary/30"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Notes (en option)</label>
                    <textarea 
                      placeholder="Indiquez vos préférences (allergies, anniversaire, terrasse...)"
                      value={resData.notes}
                      onChange={(e) => setResData({ ...resData, notes: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 min-h-[100px] text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  <button 
                    disabled={isBookingTable}
                    onClick={async () => {
                      try {
                        await bookTable({ estId: est.id, ...resData }).unwrap()
                        setBookingSuccess(true)
                      } catch (err) {
                        console.error('Table booking error:', err)
                      }
                    }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold tracking-wide hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                  >
                    {isBookingTable ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                    Confirmer la demande
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    En confirmant, vous acceptez que l'établissement soit informé de vos coordonnées pour traiter la réservation.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shopping Cart Modal ── */}
      <AnimatePresence>
        {orderModalOpen && (
          <motion.div 
            className="fixed inset-0 z-[120] flex items-center justify-end bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOrderModalOpen(false)}
          >
            <motion.div 
              className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <ShoppingBag className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-dark">Votre Panier</h3>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{est.name}</p>
                   </div>
                </div>
                <button onClick={() => setOrderModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {orderSuccess ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-subtle">
                          <CheckCircle2 className="w-10 h-10 text-green-500" />
                       </div>
                       <h3 className="text-2xl font-bold text-dark">Commande envoyée !</h3>
                       <p className="text-gray-500 text-sm">
                          Votre commande arrive ! Vous pouvez suivre son statut dans votre profil.
                       </p>
                       <button 
                         onClick={() => {
                           setOrderModalOpen(false)
                           setOrderSuccess(false)
                           dispatch(clearCart())
                         }}
                         className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg"
                       >
                          Fermer
                       </button>
                    </div>
                 ) : cart.items.length > 0 ? (
                   <>
                    <div className="space-y-4">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-dark text-sm truncate">{item.name}</h4>
                              <p className="text-primary font-bold text-xs mt-1">{item.price} FCFA</p>
                           </div>
                           <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(0, item.quantity - 1) }))}>
                                 <Minus className="w-3.5 h-3.5 text-gray-400" />
                              </button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                                 <Plus className="w-3.5 h-3.5 text-primary" />
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 space-y-4 border-t border-gray-100">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Adresse de livraison</label>
                          <textarea 
                            placeholder="Entrez votre adresse exacte (ou 'Sur place')"
                            value={orderAddress}
                            onChange={(e) => setOrderAddress(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-primary transition-all min-h-[80px] resize-none"
                          />
                       </div>
                    </div>
                   </>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <ShoppingBag className="w-16 h-16 text-gray-100" />
                      <p className="text-gray-400">Votre panier est vide.</p>
                   </div>
                 )}
              </div>

              {cart.items.length > 0 && !orderSuccess && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                   <div className="flex justify-between items-end mb-6">
                      <span className="text-gray-500 font-medium">Total Commande</span>
                      <div className="text-right">
                         <p className="text-3xl font-display font-bold text-primary">
                            {cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0)} <span className="text-sm">FCFA</span>
                         </p>
                      </div>
                   </div>
                   <button 
                     disabled={isOrdering || !orderAddress.trim()}
                     onClick={async () => {
                       if (!isAuthenticated) {
                         KeycloakService.login({ redirectUri: window.location.href })
                         return
                       }
                       try {
                         await createOrder({
                           estId: est.id,
                           items: cart.items,
                           total: cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0),
                           adresse_livraison: orderAddress
                         }).unwrap()
                         setOrderSuccess(true)
                       } catch (err) {
                         console.error('Order error:', err)
                       }
                     }}
                     className="w-full py-4 bg-primary text-white rounded-2xl font-bold tracking-wide hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                   >
                     {isOrdering ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                     Commander maintenant
                   </button>
                   {!isAuthenticated && <p className="text-[10px] text-center text-gray-400 mt-3">Requis : Connexion Keycloak</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatModal 
        isOpen={chatModalOpen} 
        onClose={() => setChatModalOpen(false)} 
        partnerName={est.name} 
        partnerId={est.id} 
      />
    </div>
  )
}
