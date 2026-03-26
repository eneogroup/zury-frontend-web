import { useSearchParams, useNavigate } from 'react-router-dom'
import { Tag, CalendarDays, Calendar, Clock, Sunset, LayoutGrid } from 'lucide-react'
import { motion } from 'framer-motion'
import DI from '../../../di/ioc'
import EventCard from '../shared/ui/EventCard'
import EventCardSkeleton from '../shared/ui/EventCardSkeleton'
import EmptyState from '../shared/ui/EmptyState'
import Pagination from '../shared/ui/Pagination'
import type { IEventsViewModel } from '../../../service/interface/events.viewmodel.interface'

const PERIOD_FILTERS = [
  { id: 'all',       label: 'Tous',          Icon: LayoutGrid,   subtitle: 'Tous les événements'          },
  { id: 'upcoming',  label: 'À venir',       Icon: CalendarDays, subtitle: 'Prochainement à Brazzaville'  },
  { id: 'this_week', label: 'Cette semaine', Icon: Calendar,     subtitle: 'Événements de la semaine'     },
  { id: 'today',     label: "Aujourd'hui",   Icon: Clock,        subtitle: "Ce qui se passe aujourd'hui"  },
  { id: 'weekend',   label: 'Ce weekend',    Icon: Sunset,       subtitle: 'Le programme du weekend'      },
]

export const EventsPage = () => {
  const { events, status, totalCount, totalPages } =
    DI.resolve<IEventsViewModel>('eventsViewModel')

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const period    = searchParams.get('period') || 'all'
  const gratuit   = searchParams.get('gratuit') === 'true'
  const currentPage = parseInt(searchParams.get('page') || '1')
  const pageSize  = 12

  const filteredEvents   = gratuit ? events.filter((e) => e.price === 'Gratuit') : events
  const paginatedEvents  = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const computedTotalPages = Math.ceil(filteredEvents.length / pageSize) || totalPages

  const activePeriod = PERIOD_FILTERS.find((f) => f.id === period) ?? PERIOD_FILTERS[0]

  const setPeriod = (p: string) => {
    const params = new URLSearchParams()
    params.set('period', p)
    if (gratuit) params.set('gratuit', 'true')
    navigate(`?${params.toString()}`)
  }

  const toggleGratuit = () => {
    const params = new URLSearchParams(searchParams)
    gratuit ? params.delete('gratuit') : params.set('gratuit', 'true')
    params.delete('page')
    navigate(`?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero header ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top section */}
          <div className="pt-12 pb-10">
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-300 mb-3">
              Brazzaville &amp; Pointe-Noire
            </p>

            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-dark leading-tight">
                  Événements à{' '}
                  <span className="text-primary italic">Brazzaville</span>
                </h1>
                <span className="accent-bar mt-2" />
                <motion.p
                  key={period}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm text-gray-400 mt-3"
                >
                  {activePeriod.subtitle}
                </motion.p>
              </div>

              {/* Gratuit toggle — top-right */}
              <button
                onClick={toggleGratuit}
                className={`hidden sm:flex items-center gap-1.5 flex-shrink-0 mb-1 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  gratuit
                    ? 'bg-green-500 text-white border-green-500 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-600'
                }`}
              >
                <Tag className="w-3 h-3" />
                Gratuit
              </button>
            </div>
          </div>

          {/* ── Period tabs — flush with the border-b ─────────────────── */}
          <div className="flex items-center gap-0 -mb-px">
            {PERIOD_FILTERS.map((f) => {
              const isActive = period === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setPeriod(f.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-dark hover:border-gray-200'
                  }`}
                >
                  <f.Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-gray-300'}`} />
                  {f.label}
                </button>
              )
            })}

            {/* Mobile gratuit */}
            <div className="flex-1 flex justify-end pb-1">
              <button
                onClick={toggleGratuit}
                className={`sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  gratuit
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-600'
                }`}
              >
                <Tag className="w-3 h-3" />
                Gratuit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content area ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Results toolbar */}
        {status !== 'loading' && filteredEvents.length > 0 && (
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="text-base font-bold text-dark">{filteredEvents.length}</span>
              {' '}événement{filteredEvents.length !== 1 ? 's' : ''}
              {gratuit && (
                <span className="ml-2 text-green-600 font-medium text-xs">· Gratuits uniquement</span>
              )}
            </p>
          </div>
        )}

        {/* Grid */}
        {status === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(8)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedEvents.length === 0 ? (
          <EmptyState
            title="Aucun événement trouvé"
            message={
              gratuit
                ? 'Aucun événement gratuit pour cette période.'
                : "Il n'y a pas d'événements prévus pour cette période."
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedEvents.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={computedTotalPages}
              totalCount={filteredEvents.length}
              pageSize={pageSize}
            />
          </>
        )}
      </div>
    </div>
  )
}
