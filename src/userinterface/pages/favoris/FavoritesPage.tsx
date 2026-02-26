import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2, Store, Calendar, ArrowRight, HeartOff } from 'lucide-react'
import { useFavorites } from '../../../service/hooks/useFavorites'
import type { FavoriteItem } from '../../../service/hooks/useFavorites'

function FavoriteCard({ item, onRemove }: { item: FavoriteItem; onRemove: () => void }) {
  const href = item.type === 'establishment' ? `/establishments/${item.id}` : `/evenements/${item.id}`
  const savedDate = new Date(item.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-gray-200 transition-all duration-200">
        <Link to={href} className="flex items-center gap-4 p-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                {item.type === 'establishment'
                  ? <Store className="w-6 h-6 text-primary" />
                  : <Calendar className="w-6 h-6 text-primary" />
                }
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                item.type === 'establishment'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {item.type === 'establishment' ? 'Établissement' : 'Événement'}
              </span>
              <span className="text-[10px] text-gray-300">· {savedDate}</span>
            </div>
            <h3 className="font-semibold text-dark group-hover:text-primary transition-colors truncate">
              {item.name}
            </h3>
            <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary flex-shrink-0 transition-colors" />
        </Link>

        {/* Remove button */}
        <div className="border-t border-gray-50 px-4 py-2.5 flex justify-end">
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Retirer des favoris
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites()

  const establishments = favorites.filter((f) => f.type === 'establishment')
  const events = favorites.filter((f) => f.type === 'event')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Mes préférences
          </p>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight">
              Mes <span className="text-primary italic">Favoris</span>
            </h1>
            {favorites.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-full text-sm font-semibold">
                <Heart className="w-3.5 h-3.5 fill-red-500" />
                {favorites.length}
              </span>
            )}
          </div>
          <span className="accent-bar mt-3" />
          <p className="text-gray-500 mt-4">
            {favorites.length === 0
              ? 'Aucun favori pour le moment'
              : `${favorites.length} élément${favorites.length > 1 ? 's' : ''} sauvegardé${favorites.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <HeartOff className="w-10 h-10 text-red-300" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-dark mb-3">
              Aucun favori pour le moment
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              Cliquez sur le cœur sur les établissements ou événements pour les retrouver ici.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/explorer"
                className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                Explorer les établissements
              </Link>
              <Link
                to="/evenements"
                className="px-6 py-3 bg-white border border-gray-200 text-dark rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-all"
              >
                Voir les événements
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Establishments section */}
            {establishments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-dark">
                    Établissements
                    <span className="ml-2 text-sm text-gray-400 font-normal">({establishments.length})</span>
                  </h2>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {establishments.map((item) => (
                      <FavoriteCard
                        key={item.id}
                        item={item}
                        onRemove={() => removeFavorite(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Events section */}
            {events.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-dark">
                    Événements
                    <span className="ml-2 text-sm text-gray-400 font-normal">({events.length})</span>
                  </h2>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {events.map((item) => (
                      <FavoriteCard
                        key={item.id}
                        item={item}
                        onRemove={() => removeFavorite(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
