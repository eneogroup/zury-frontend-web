import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, ChevronLeft, ChevronRight, TrendingUp, Users, BarChart3, Rocket, ArrowRight, UtensilsCrossed, Wine, Hotel, Cake } from 'lucide-react'
import DI from '../../../di/ioc'
import EstablishmentCard from '../shared/ui/EstablishmentCard'
import EventCard from '../shared/ui/EventCard'
import EstablishmentCardSkeleton from '../shared/ui/EstablishmentCardSkeleton'
import Button from '../shared/ui/Button'
import type { IHomeViewModel } from '../../../service/interface/home.viewmodel.interface'

// ── Hero ──────────────────────────────────────────────────────────────────────
const heroImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2074',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074',
]

function Hero({ stats }: { stats: any }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroImages.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(searchQuery.trim() ? `/explorer?q=${encodeURIComponent(searchQuery)}` : '/explorer')
  }

  const categories = [
    { id: 'all', label: 'Tous les établissements', icon: <MapPin className="w-5 h-5" /> },
    { id: 'restaurant', label: '🍽️ Restaurants' },
    { id: 'bar', label: '🍹 Bars' },
    { id: 'hotel', label: '🏨 Hôtels' },
    { id: 'event', label: '🎉 Événements' },
  ]

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${image}')` }} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/40" />
      </div>

      <button onClick={() => setCurrentSlide((p) => (p - 1 + heroImages.length) % heroImages.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={() => setCurrentSlide((p) => (p + 1) % heroImages.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'}`} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Où voulez-vous sortir ?</h1>
          <p className="text-xl text-white/90">Découvrez les meilleurs restaurants, bars et événements de Brazzaville</p>
        </div>

        <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                category === cat.id ? 'bg-white text-dark shadow-lg' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}>
              {cat.icon}{cat.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-5 flex items-center gap-3 px-4 py-3 border-r border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Rechercher un restaurant, bar, hôtel..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-dark placeholder:text-gray-400" />
            </div>
            <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 border-r border-gray-200">
              <MapPin className="w-5 h-5 text-gray-400" />
              <select className="flex-1 outline-none text-dark bg-transparent cursor-pointer">
                <option value="">Tous les quartiers</option>
                <option value="centre-ville">Centre-ville</option>
                <option value="poto-poto">Poto-Poto</option>
                <option value="bacongo">Bacongo</option>
                <option value="moungali">Moungali</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 px-4 py-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-dark">Aujourd'hui</span>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" variant="primary" className="w-full h-full text-lg">Rechercher</Button>
            </div>
          </div>
        </form>

        {stats && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.etablissements?.total || 50}+</div>
              <div className="text-sm text-white/80">Établissements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.events?.total_a_venir || 10}+</div>
              <div className="text-sm text-white/80">Événements à venir</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-white/80">Recherches journalières</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Categories ────────────────────────────────────────────────────────────────
const categoriesList = [
  { name: 'Hôtel', icon: Hotel, slug: 'hotel', gradient: 'from-accent to-accent/10', image: 'https://media-cdn.tripadvisor.com/media/photo-s/2e/3b/29/4b/caption.jpg' },
  { name: 'Restaurant', icon: UtensilsCrossed, slug: 'restaurant', gradient: 'from-primary to-primary/10', image: 'https://www.olympic-palace-hotel.net/assets/img/oph_oriental1.jpg' },
  { name: 'Bar/Lounge', icon: Wine, slug: 'bar', gradient: 'from-gold to-gold/10', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/07/b2/3b/vue-d-ensemble-du-pichichi.jpg?w=1200&h=-1&s=1' },
  { name: 'Patisserie', icon: Cake, slug: 'lounge', gradient: 'from-dark to-dark/10', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/1c/3d/82/photo0jpg.jpg?w=900&h=500&s=1' },
]

function Categories() {
  return (
    <section className="py-16 mt-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-white mb-10">Catégories</motion.h2>
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoriesList.map((category) => {
            const Icon = category.icon
            return (
              <motion.div key={category.slug} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} whileTap={{ scale: 0.95 }}>
                <Link to="/explorer" className="group block">
                  <div className="relative rounded-2xl p-8 md:p-10 text-center overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-48">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${category.image})` }} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} group-hover:opacity-90 transition-opacity duration-300`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                      <Icon className="w-14 h-14 md:w-16 md:h-16 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                      <h3 className="text-lg md:text-xl font-bold drop-shadow-md">{category.name}</h3>
                    </div>
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ── JoinCTA ───────────────────────────────────────────────────────────────────
const benefits = [
  { icon: Users, text: "Des milliers d'utilisateurs" },
  { icon: TrendingUp, text: 'Augmentez votre visibilité' },
  { icon: BarChart3, text: 'Statistiques en temps réel' },
  { icon: Rocket, text: 'Inscription gratuite' },
]

function JoinZuryCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
      <motion.div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
              Vous êtes propriétaire d'un établissement ?
            </motion.h2>
            <motion.p className="text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
              Rejoignez ZURY et développez votre visibilité auprès de milliers de clients potentiels !
            </motion.p>
            <motion.div className="grid grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}>
              {benefits.map((benefit, i) => (
                <motion.div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }} transition={{ duration: 0.3 }}>
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/rejoindre-zury" className="flex-1">
                <Button variant="primary" size="lg" className="w-full bg-white text-primary hover:bg-white/90 shadow-2xl">
                  Rejoindre ZURY <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Button>
              </Link>
              <Link to="/rejoindre-zury" className="flex-1">
                <Button variant="outline" size="lg" className="w-full border-2 border-white text-white hover:bg-white hover:text-primary">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div className="relative hidden lg:block" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="relative h-80">
              {[
                { icon: Users, value: '1200+', label: 'Utilisateurs actifs', pos: 'top-0 right-0', color: 'primary' },
                { icon: TrendingUp, value: '+250%', label: 'Visibilité moyenne', pos: 'top-32 left-0', color: 'accent' },
                { icon: BarChart3, value: '5000+', label: 'Vues par mois', pos: 'bottom-0 right-12', color: 'gold' },
              ].map(({ icon: Icon, value, label, pos, color }, i) => (
                <motion.div key={i} className={`absolute ${pos} bg-white rounded-2xl p-6 shadow-2xl w-56`}
                  initial={{ opacity: 0, y: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.2 }} whileHover={{ y: -5 }}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${color}`} />
                    </div>
                    <div><p className="text-2xl font-bold text-dark">{value}</p><p className="text-sm text-gray-500">{label}</p></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── HomePage ──────────────────────────────────────────────────────────────────
export const HomePage = () => {
  const { featuredEstablishments, recentEstablishments, upcomingEvents, stats, featuredStatus, upcomingStatus } =
    DI.resolve<IHomeViewModel>('homeViewModel')

  return (
    <>
      <Hero stats={stats} />
      <div className="bg-light">
        <Categories />

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-dark mb-8">Restaurants coup de cœur du moment</h2>
            {featuredStatus === 'loading' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <EstablishmentCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredEstablishments.slice(0, 8).map((e, i) => <EstablishmentCard key={e.id} establishment={e} index={i} />)}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-primary/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Événements à venir</h2>
              <Link to="/evenements" className="text-white hover:text-white/80 font-medium transition-colors">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {upcomingEvents.slice(0, 8).map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
            </div>
          </div>
        </section>

        {recentEstablishments.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-dark">Nouveaux établissements</h2>
                  <p className="text-lg text-gray-500">Découvrez les dernières adresses ajoutées à ZURY</p>
                </div>
                <Link to="/explorer?sort=recent" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors">
                  Voir tous les nouveaux <span>→</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentEstablishments.map((e, i) => <EstablishmentCard key={e.id} establishment={e} index={i} />)}
              </div>
            </div>
          </section>
        )}

        <JoinZuryCTA />
      </div>
    </>
  )
}
