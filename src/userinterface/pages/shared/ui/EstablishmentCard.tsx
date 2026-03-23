import { MapPin, Star, ArrowRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useFavorites } from '../../../../service/hooks/useFavorites'
import { EstablishmentGateway } from '../../../../infrastructure/gateways/establishment.gateway'
import { getDeviceId } from '../../../../service/utils/deviceId'

const CATEGORY_CONFIG: Record<string, { dot: string; badge: string; label: string }> = {
  restaurant: { dot: 'bg-primary', badge: 'bg-primary/10 text-primary', label: 'Restaurant' },
  bar:        { dot: 'bg-gold',    badge: 'bg-gold/15 text-yellow-700',  label: 'Bar' },
  hotel:      { dot: 'bg-blue-500',badge: 'bg-blue-50 text-blue-600',    label: 'Hôtel' },
  lounge:     { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-600', label: 'Lounge' },
}

interface EstablishmentCardProps {
  establishment: {
    id: string
    name: string
    category: 'restaurant' | 'bar' | 'hotel' | 'lounge'
    address: string
    neighborhood: string
    rating: number
    reviewCount: number
    imageUrl: string
    isPremium?: boolean
    isOpen?: boolean
  }
  index?: number
  showOpenStatus?: boolean
  source?: string
}

export default function EstablishmentCard({ establishment, index = 0, showOpenStatus = false, source = 'direct' }: EstablishmentCardProps) {
  const cfg = CATEGORY_CONFIG[establishment.category] ?? CATEGORY_CONFIG.restaurant
  const { isFavorite, toggleFavorite } = useFavorites()
  const openStatus = establishment.isOpen === true ? 'open' : establishment.isOpen === false ? 'closed' : 'unknown'
  const fav = isFavorite(establishment.id)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({
      id: establishment.id,
      type: 'establishment',
      name: establishment.name,
      imageUrl: establishment.imageUrl,
      subtitle: establishment.neighborhood,
      savedAt: Date.now(),
    })
  }

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          try {
            new EstablishmentGateway().trackView({
              etablissement: establishment.id,
              device_id: getDeviceId(),
              duree_consultation: 0,
              source: source,
            });
          } catch (e) {}
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [establishment.id, source]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/establishments/${establishment.id}`} state={{ trackingSource: source }} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">

          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-gray-100">
            <img
              src={establishment.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'}
              alt={establishment.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${cfg.badge} bg-white/90`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>

            {/* Top-right: Premium + Open status */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
              {establishment.isPremium && (
                <span className="bg-gold/90 text-dark text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
                  Premium
                </span>
              )}
              {showOpenStatus && openStatus !== 'unknown' && (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 ${
                  openStatus === 'open'
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${openStatus === 'open' ? 'bg-white animate-pulse' : 'bg-white/70'}`} />
                  {openStatus === 'open' ? 'Ouvert' : 'Fermé'}
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
            {/* Name */}
            <h3 className="font-display text-lg font-semibold text-dark mb-1 leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-1">
              {establishment.name}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{establishment.neighborhood}</span>
              {establishment.address && (
                <span className="text-gray-300">· {establishment.address}</span>
              )}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              {/* Stars */}
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${
                      i <= Math.round(establishment.rating) ? 'fill-gold text-gold' : 'text-gray-200'
                    }`} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-dark">{establishment.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({establishment.reviewCount})</span>
              </div>

              {/* Arrow */}
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
