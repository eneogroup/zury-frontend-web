import { MapPin, Clock, ArrowRight, Heart, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../../../../service/hooks/useFavorites'

interface EventCardProps {
  event: {
    id: string
    title: string
    category: string
    date: string
    time: string
    establishment: string
    price: string
    availablePlaces: number
    totalPlaces: number
    imageUrl: string
    isComplete?: boolean
  }
  index?: number
}

function parseDateChip(dateStr: string) {
  if (!dateStr) return { day: '—', month: '—' }
  const months: Record<string, string> = {
    janvier: 'JAN', février: 'FÉV', mars: 'MAR', avril: 'AVR',
    mai: 'MAI', juin: 'JUN', juillet: 'JUL', août: 'AOÛ',
    septembre: 'SEP', octobre: 'OCT', novembre: 'NOV', décembre: 'DÉC',
  }
  const parts = dateStr.split(' ')
  if (parts.length >= 3) {
    return {
      day: parts[1] || '',
      month: months[parts[2]?.toLowerCase()] ?? parts[2]?.slice(0, 3).toUpperCase() ?? '',
    }
  }
  return { day: dateStr.slice(0, 2), month: '' }
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const { day, month } = parseDateChip(event.date)
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(event.id)

  const totalPlaces = event.totalPlaces ?? 0
  const availablePlaces = event.availablePlaces ?? 0
  const usedPlaces = totalPlaces - availablePlaces
  const capacityPct = totalPlaces > 0 ? Math.min((usedPlaces / totalPlaces) * 100, 100) : 0
  const availablePct = totalPlaces > 0 ? Math.min((availablePlaces / totalPlaces) * 100, 100) : 100
  const almostFull = totalPlaces > 0 && availablePct < 25
  const isComplete = event.isComplete || (totalPlaces > 0 && availablePlaces === 0)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({
      id: event.id,
      type: 'event',
      name: event.title,
      imageUrl: event.imageUrl,
      subtitle: event.establishment,
      savedAt: Date.now(),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/evenements/${event.id}`} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">

          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-gray-100">
            <img
              src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80'}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Date chip */}
            <div className="absolute top-3 left-3 bg-white rounded-xl overflow-hidden shadow-md w-11 text-center">
              <div className="bg-primary py-0.5">
                <span className="text-white text-[9px] font-bold uppercase tracking-wider">{month}</span>
              </div>
              <div className="py-1">
                <span className="text-dark font-display text-lg font-bold leading-none">{day}</span>
              </div>
            </div>

            {/* Category + Complet badge */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
              <span className="bg-white/90 backdrop-blur-sm text-dark/70 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {event.category}
              </span>
              {isComplete && (
                <span className="bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
                  Complet
                </span>
              )}
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                fav
                  ? 'bg-red-500 text-white shadow-lg scale-110'
                  : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="font-display text-lg font-semibold text-dark mb-2 leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {event.title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                {event.time}
              </span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{event.establishment}</span>
              </span>
            </div>

            {/* Capacity bar */}
            {totalPlaces > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>
                      {isComplete ? (
                        <span className="text-red-500 font-semibold">Complet</span>
                      ) : almostFull ? (
                        <span className="text-orange-500 font-semibold">Plus que {availablePlaces} place{availablePlaces > 1 ? 's' : ''}</span>
                      ) : (
                        <span>{availablePlaces} place{availablePlaces > 1 ? 's' : ''} disponible{availablePlaces > 1 ? 's' : ''}</span>
                      )}
                    </span>
                  </span>
                  <span className="text-xs text-gray-300">{totalPlaces} total</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isComplete ? 'bg-red-400' : almostFull ? 'bg-orange-400' : 'bg-primary'
                    }`}
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <span className="font-display text-xl font-semibold text-primary leading-none">
                {event.price}
              </span>

              <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-400 transition-all duration-200">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
