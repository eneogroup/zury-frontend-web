import { useSearchParams, useNavigate } from 'react-router-dom'
import { Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import DI from '../../../di/ioc'
import EventCard from '../shared/ui/EventCard'
import EventCardSkeleton from '../shared/ui/EventCardSkeleton'
import EmptyState from '../shared/ui/EmptyState'
import Pagination from '../shared/ui/Pagination'
import type { IEventsViewModel } from '../../../service/interface/events.viewmodel.interface'

const PERIOD_FILTERS = [
  { id: 'upcoming', label: 'À venir' },
  { id: 'today', label: "Aujourd'hui" },
  { id: 'weekend', label: 'Ce weekend' },
  { id: 'all', label: 'Tous' },
]

export const EventsPage = () => {
  const { events, status, totalCount, totalPages } = DI.resolve<IEventsViewModel>('eventsViewModel')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const period = searchParams.get('period') || 'upcoming'
  const gratuit = searchParams.get('gratuit') === 'true'
  const currentPage = parseInt(searchParams.get('page') || '1')
  const pageSize = 12

  const filteredEvents = gratuit ? events.filter((e) => e.price === 'Gratuit') : events
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const computedTotalPages = Math.ceil(filteredEvents.length / pageSize) || totalPages

  const setPeriod = (p: string) => {
    const params = new URLSearchParams()
    params.set('period', p)
    if (gratuit) params.set('gratuit', 'true')
    navigate(`?${params.toString()}`)
  }

  const toggleGratuit = () => {
    const params = new URLSearchParams(searchParams)
    if (gratuit) {
      params.delete('gratuit')
    } else {
      params.set('gratuit', 'true')
    }
    params.delete('page')
    navigate(`?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Brazzaville & Pointe-Noire
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight mb-2">
            Événements à{' '}
            <span className="text-primary italic">Brazzaville</span>
          </h1>
          <span className="accent-bar mt-3" />
          <p className="text-gray-500 mt-4">Découvrez les meilleurs événements de la ville</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {/* Period filters */}
          {PERIOD_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setPeriod(f.id)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                period === f.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}>
              {f.label}
            </button>
          ))}

          {/* Separator */}
          <span className="w-px h-6 bg-gray-200 mx-1" />

          {/* Gratuit toggle */}
          <motion.button
            onClick={toggleGratuit}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all border ${
              gratuit
                ? 'bg-green-500 text-white border-green-500 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Gratuit
          </motion.button>
        </div>

        {status === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : paginatedEvents.length === 0 ? (
          <EmptyState
            title="Aucun événement trouvé"
            message={gratuit
              ? "Aucun événement gratuit pour cette période."
              : "Il n'y a pas d'événements prévus pour cette période."
            }
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''}
              {gratuit && <span className="ml-2 text-green-600 font-medium">· Gratuits uniquement</span>}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedEvents.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
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
