import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

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
  const capacityPct = event.totalPlaces > 0
    ? Math.min((event.availablePlaces / event.totalPlaces) * 100, 100)
    : 100
  const almostFull = capacityPct < 25

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

            {/* Category */}
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 backdrop-blur-sm text-dark/70 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {event.category}
              </span>
            </div>
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

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div>
                <span className="font-display text-xl font-semibold text-primary leading-none">
                  {event.price}
                </span>
                {almostFull && (
                  <span className="ml-2 text-[10px] text-red-500 font-semibold uppercase tracking-wide">
                    Presque complet
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Capacity bar */}
                {event.totalPlaces > 0 && (
                  <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${almostFull ? 'bg-red-400' : 'bg-primary'}`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                )}
                <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-400 transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
