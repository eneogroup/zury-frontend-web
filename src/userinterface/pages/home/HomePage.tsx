import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, ArrowRight, TrendingUp, Users, BarChart3, Rocket,
  UtensilsCrossed, Wine, Hotel, Cake, ChevronRight, Clock, Calendar,
} from 'lucide-react'
import { CountUp } from '../shared/ui/CountUp'
import DI from '../../../di/ioc'
import EstablishmentCard from '../shared/ui/EstablishmentCard'
import EventCard from '../shared/ui/EventCard'
import EstablishmentCardSkeleton from '../shared/ui/EstablishmentCardSkeleton'
import EventCardSkeleton from '../shared/ui/EventCardSkeleton'
import type { IHomeViewModel } from '../../../service/interface/home.viewmodel.interface'

/* ── Hero images ─────────────────────────────────────────────────────────── */
const heroImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2074',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074',
]

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function Hero({ stats }: { stats: any }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % heroImages.length), 6000)
    return () => clearInterval(t)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(searchQuery.trim() ? `/explorer?q=${encodeURIComponent(searchQuery)}` : '/explorer')
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden">

      {/* ── Background slides ── */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {heroImages.map((img, i) =>
            i === currentSlide ? (
              <motion.div key={i} className="absolute inset-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1.4 }}>
                <div className="absolute inset-0 bg-cover bg-center scale-105"
                  style={{ backgroundImage: `url('${img}')` }} />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
        {/* left column darkened for legibility, right softer */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/65 to-dark/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/30" />
      </div>

      {/* ── Vertical dot nav (right) ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-20 flex flex-col gap-2.5">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)}
            className={`rounded-full transition-all duration-400 ${
              i === currentSlide ? 'h-8 w-1 bg-primary' : 'h-2 w-1 bg-white/30 hover:bg-white/60'
            }`} />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 pt-36 lg:pb-24">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-5">
          Brazzaville &amp; Pointe-Noire
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,8vw,6rem)] font-bold text-white leading-[0.92] tracking-tight mb-7 max-w-2xl">
          Où voulez‑vous<br />
          <span className="text-transparent bg-clip-text bg-ember-gradient italic">sortir&nbsp;?</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-white/65 text-base md:text-lg mb-9 max-w-md leading-relaxed">
          Les meilleurs restaurants, bars, hôtels et événements de Brazzaville — à portée de main.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}>
          <form onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 max-w-lg">
            <Search className="w-4 h-4 text-white/50 ml-2 flex-shrink-0" />
            <input
              type="text" placeholder="Restaurant, bar, quartier…"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder:text-white/35 outline-none text-sm py-2" />
            <button type="submit"
              className="bg-primary hover:bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 shadow-ember">
              Rechercher
            </button>
          </form>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: '🍽️ Restaurants', q: 'restaurant' },
              { label: '🍹 Bars', q: 'bar' },
              { label: '🏨 Hôtels', q: 'hotel' },
              { label: '🎉 Événements', href: '/evenements' },
            ].map((chip) => (
              <button key={chip.label}
                onClick={() => navigate(chip.href ?? `/explorer?categorie=${chip.q}`)}
                className="text-xs text-white/55 hover:text-white border border-white/15 hover:border-white/40 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm hover:bg-white/5">
                {chip.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}>
            {[
              { value: stats.total_etablissements ?? 0, label: 'Établissements' },
              { value: stats.total_events ?? 0,         label: 'Événements' },
              { value: stats.vues_aujourd_hui ?? 0,     label: "Vues aujourd'hui" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display text-3xl md:text-4xl font-bold text-white">
                  <CountUp value={s.value} suffix="+" duration={1800} />
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ── Date helper ─────────────────────────────────────────────────────────── */
const MONTHS: Record<string, string> = {
  janvier:'JAN',février:'FÉV',mars:'MAR',avril:'AVR',
  mai:'MAI',juin:'JUN',juillet:'JUL',août:'AOÛ',
  septembre:'SEP',octobre:'OCT',novembre:'NOV',décembre:'DÉC',
}
function parseDateChip(d: string) {
  const p = d?.split(' ') ?? []
  if (p.length >= 3) return { day: p[1] ?? '—', month: MONTHS[p[2]?.toLowerCase()] ?? p[2]?.slice(0,3).toUpperCase() ?? '—' }
  return { day: d?.slice(0,2) ?? '—', month: '' }
}

const EVENT_FALLBACK = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'

/* ── Section header helper ────────────────────────────────────────────────── */
function SectionHeader({
  eyebrow, title, linkTo, linkLabel, dark = false, ember = false,
}: {
  eyebrow: string; title: string; linkTo?: string; linkLabel?: string; dark?: boolean; ember?: boolean
}) {
  const eyebrowCls = ember ? 'text-white/60' : dark ? 'text-primary/80' : 'text-gray-400'
  const titleCls   = ember || dark ? 'text-white' : 'text-dark'
  const linkCls    = ember
    ? 'text-white/60 hover:text-white'
    : dark ? 'text-white/50 hover:text-white' : 'text-primary hover:text-primary/70'

  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-2 ${eyebrowCls}`}>{eyebrow}</p>
        <h2 className={`font-display text-3xl font-bold ${titleCls}`}>{title}</h2>
        <span className={`accent-bar mt-2 ${ember ? 'bg-white' : ''}`} />
      </div>
      {linkTo && linkLabel && (
        <Link to={linkTo}
          className={`hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors ${linkCls}`}>
          {linkLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

/* ── Categories ───────────────────────────────────────────────────────────── */
const categoriesList = [
  { name: 'Hôtels',       icon: Hotel,          slug: 'hotel',      image: 'https://media-cdn.tripadvisor.com/media/photo-s/2e/3b/29/4b/caption.jpg' },
  { name: 'Restaurants',  icon: UtensilsCrossed, slug: 'restaurant', image: 'https://www.olympic-palace-hotel.net/assets/img/oph_oriental1.jpg' },
  { name: 'Bars & Lounge',icon: Wine,            slug: 'bar',        image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/07/b2/3b/vue-d-ensemble-du-pichichi.jpg?w=1200&h=-1&s=1' },
  { name: 'Pâtisseries',  icon: Cake,            slug: 'lounge',     image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/1c/3d/82/photo0jpg.jpg?w=900&h=500&s=1' },
]

function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Explorer par" title="Catégories" linkTo="/explorer" linkLabel="Tout explorer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesList.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div key={cat.slug}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <Link to={`/explorer?categorie=${cat.slug}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden h-44 md:h-56">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${cat.image})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <Icon className="w-5 h-5 text-white/70 mb-1.5" />
                      <h3 className="text-white font-bold text-base leading-tight">{cat.name}</h3>
                    </div>
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── JoinZuryCTA ──────────────────────────────────────────────────────────── */
const benefits = [
  { icon: Users,    text: "Milliers d'utilisateurs" },
  { icon: TrendingUp, text: 'Visibilité accrue' },
  { icon: BarChart3,  text: 'Stats en temps réel' },
  { icon: Rocket,     text: 'Inscription gratuite' },
]

function JoinZuryCTA() {
  return (
    <section className="py-24 bg-dark relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            className="text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-5"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Propriétaires d'établissements
          </motion.p>
          <motion.h2
            className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Rejoignez{' '}
            <span className="text-transparent bg-clip-text bg-ember-gradient italic">ZURY</span>
          </motion.h2>
          <motion.p
            className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Augmentez votre visibilité auprès de milliers de clients à Brazzaville et Pointe-Noire.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Link to="/rejoindre-zury"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-accent transition-all shadow-ember">
              Inscrire mon établissement <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/rejoindre-zury"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 text-white/70 rounded-2xl font-semibold hover:bg-white/5 hover:text-white transition-all">
              En savoir plus
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-10 border-t border-white/8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.4 }}>
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-white/40 text-sm">
                <b.icon className="w-4 h-4 text-primary/60" />
                {b.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── HomePage ─────────────────────────────────────────────────────────────── */
export const HomePage = () => {
  const {
    featuredEstablishments, recentEstablishments,
    upcomingEvents, weekendEvents, stats,
    featuredStatus, upcomingStatus, weekendStatus,
  } = DI.resolve<IHomeViewModel>('homeViewModel')

  return (
    <>
      <Hero stats={stats} />

      <div className="bg-light">
        <Categories />

        {/* ── Établissements coup de cœur ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Nos coups de cœur"
              title="Restaurants du moment"
              linkTo="/explorer?categorie=restaurant"
              linkLabel="Voir tous"
            />
            {featuredStatus === 'loading' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => <EstablishmentCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredEstablishments.slice(0, 8).map((e, i) => (
                  <EstablishmentCard key={e.id} establishment={e} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Événements à venir ── */}
        <section className="py-16 bg-ember">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Ne ratez rien"
              title="Événements à venir"
              linkTo="/evenements"
              linkLabel="Voir tout"
              ember
            />

            {upcomingStatus === 'loading' ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 h-96 rounded-2xl bg-black/10 animate-pulse" />
                <div className="lg:col-span-3 flex flex-col gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-black/10 animate-pulse" />
                  ))}
                </div>
              </div>
            ) : upcomingEvents.length === 0 ? null : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* ── Featured event (big card) ── */}
                {(() => {
                  const ev = upcomingEvents[0]
                  const { day, month } = parseDateChip(ev.date)
                  return (
                    <Link to={`/evenements/${ev.id}`}
                      className="lg:col-span-2 group block relative min-h-[380px] rounded-2xl overflow-hidden">
                      <img
                        src={ev.imageUrl || EVENT_FALLBACK} alt={ev.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = EVENT_FALLBACK }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                      {/* Date chip */}
                      <div className="absolute top-4 left-4 bg-dark rounded-xl px-3 py-2 text-center min-w-[44px]">
                        <div className="text-white/60 text-[8px] font-bold uppercase tracking-wider">{month}</div>
                        <div className="text-white font-display text-2xl font-bold leading-none">{day}</div>
                      </div>

                      {/* Category */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                          {ev.category}
                        </span>
                      </div>

                      {/* Bottom content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-display text-2xl font-bold text-white mb-2 leading-snug line-clamp-2">
                          {ev.title}
                        </h3>
                        <div className="flex items-center gap-3 text-white/50 text-xs mb-4">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                          <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{ev.establishment}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xl font-bold text-white">{ev.price}</span>
                          <span className="w-9 h-9 rounded-full bg-dark group-hover:bg-dark/80 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-4 h-4 text-white" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })()}

                {/* ── Remaining events (compact rows) ── */}
                <div className="lg:col-span-3 flex flex-col gap-3">
                  {upcomingEvents.slice(1, 5).map((ev) => {
                    const { day, month } = parseDateChip(ev.date)
                    return (
                      <Link key={ev.id} to={`/evenements/${ev.id}`}
                        className="group flex items-center gap-4 bg-black/10 hover:bg-black/20 border border-black/10 hover:border-black/25 rounded-2xl p-4 transition-all duration-200">

                        {/* Date block */}
                        <div className="bg-dark rounded-xl px-2.5 py-2 text-center flex-shrink-0 w-11">
                          <div className="text-white/70 text-[8px] font-bold uppercase">{month}</div>
                          <div className="text-white font-display text-lg font-bold leading-none">{day}</div>
                        </div>

                        {/* Thumb */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
                          <img src={ev.imageUrl || EVENT_FALLBACK} alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = EVENT_FALLBACK }} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm leading-snug line-clamp-1 mb-0.5">
                            {ev.title}
                          </h4>
                          <p className="text-white/35 text-xs truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />{ev.establishment}
                          </p>
                        </div>

                        {/* Price + arrow */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-display text-sm font-bold text-white">{ev.price}</span>
                          <span className="w-7 h-7 rounded-full bg-black/15 group-hover:bg-dark flex items-center justify-center transition-colors">
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                          </span>
                        </div>
                      </Link>
                    )
                  })}

                  {/* "Voir tous" link row */}
                  <Link to="/evenements"
                    className="flex items-center justify-center gap-2 border border-dashed border-white/30 hover:border-white/60 rounded-2xl py-4 text-white/50 hover:text-white text-sm font-medium transition-all duration-200 group">
                    <Calendar className="w-4 h-4" />
                    Voir tous les événements
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            )}
          </div>
        </section>

        {/* ── Ce weekend ── */}
        {(weekendStatus === 'loading' || weekendEvents.length > 0) && (
          <section className="py-16 bg-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                eyebrow="Sortez ce weekend"
                title="Ce weekend"
                linkTo="/evenements?period=weekend"
                linkLabel="Voir tout"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {weekendStatus === 'loading'
                  ? [...Array(4)].map((_, i) => <EventCardSkeleton key={i} />)
                  : weekendEvents.slice(0, 8).map((e, i) => <EventCard key={e.id} event={e} index={i} />)
                }
              </div>
            </div>
          </section>
        )}

        {/* ── Nouveaux établissements ── */}
        {recentEstablishments.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                eyebrow="Dernières adresses"
                title="Nouveaux établissements"
                linkTo="/explorer?ordering=-created_at"
                linkLabel="Voir tous"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recentEstablishments.map((e, i) => (
                  <EstablishmentCard key={e.id} establishment={e} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        <JoinZuryCTA />
      </div>
    </>
  )
}
