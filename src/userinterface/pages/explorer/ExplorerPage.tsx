import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DI from '../../../di/ioc'
import EstablishmentCard from '../shared/ui/EstablishmentCard'
import EstablishmentCardSkeleton from '../shared/ui/EstablishmentCardSkeleton'
import Pagination from '../shared/ui/Pagination'
import type { IExplorerViewModel } from '../../../service/interface/explorer.viewmodel.interface'

const CATEGORIES = [
  { id: '', label: 'Tous', dot: 'bg-gray-300' },
  { id: 'restaurant', label: 'Restaurants', dot: 'bg-primary' },
  { id: 'bar', label: 'Bars', dot: 'bg-gold' },
  { id: 'hotel', label: 'Hôtels', dot: 'bg-blue-400' },
  { id: 'lounge', label: 'Lounges', dot: 'bg-purple-400' },
]

const RATINGS = [
  { value: '4', label: '4★ et plus' },
  { value: '3', label: '3★ et plus' },
  { value: '2', label: '2★ et plus' },
  { value: '', label: 'Toutes les notes' },
]

export const ExplorerPage = () => {
  const { establishments, quartiers, status, totalCount, totalPages } =
    DI.resolve<IExplorerViewModel>('explorerViewModel')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1')
  const currentCategorie = searchParams.get('categorie') || ''
  const currentNeighborhood = searchParams.get('neighborhood') || ''
  const currentMinRating = searchParams.get('minRating') || ''
  const currentQ = searchParams.get('q') || ''
  const hasActiveFilters = !!(currentCategorie || currentNeighborhood || currentMinRating || currentQ)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)))
    params.delete('page')
    navigate(`?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ q: searchInput })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero header — blanc chaud ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">

          {/* Fil d'Ariane */}
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Brazzaville & Pointe-Noire
          </p>

          {/* Titre */}
          <div className="mb-8">
            {currentQ ? (
              <h1 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight">
                Résultats pour{' '}
                <span className="text-primary italic">"{currentQ}"</span>
              </h1>
            ) : (
              <h1 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight">
                Explorer{' '}
                <span className="text-primary italic">Brazzaville</span>
              </h1>
            )}
            <span className="accent-bar mt-3" />
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Restaurant, bar, hôtel, quartier..."
                className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 text-dark placeholder-gray-400 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); updateParams({ q: '' }) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit"
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md">
              Rechercher
            </button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-4 rounded-xl border transition-all lg:hidden ${
                showFilters || hasActiveFilters
                  ? 'bg-primary/5 border-primary/30 text-primary'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </form>

          {/* Chips catégories */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategorie === cat.id
              return (
                <button key={cat.id} onClick={() => updateParams({ categorie: cat.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/60' : cat.dot}`} />
                  {cat.label}
                </button>
              )
            })}
            {hasActiveFilters && (
              <button onClick={() => navigate('/explorer')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-primary hover:border-primary/30 transition-all">
                <X className="w-3.5 h-3.5" />
                Effacer tout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Contenu principal ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-dark text-sm font-semibold uppercase tracking-widest">Filtres</h3>
                  <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-400 hover:text-dark">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quartier */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">Quartier</p>
                  <div className="relative">
                    <select value={currentNeighborhood}
                      onChange={(e) => updateParams({ neighborhood: e.target.value })}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all">
                      <option value="">Tous les quartiers</option>
                      {quartiers.map((q: any) => (
                        <option key={q.value} value={q.value}>{q.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Note minimum */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">Note minimum</p>
                  <div className="space-y-1">
                    {RATINGS.map(({ value, label }) => {
                      const isActive = currentMinRating === value
                      return (
                        <button key={value} onClick={() => updateParams({ minRating: value })}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                            isActive
                              ? 'bg-primary/8 text-primary border border-primary/20'
                              : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                          }`}>
                          <div className="flex gap-0.5">
                            {value ? (
                              [...Array(parseInt(value))].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${isActive ? 'fill-primary text-primary' : 'fill-gold text-gold'}`} />
                              ))
                            ) : (
                              <Star className="w-3 h-3 text-gray-300" />
                            )}
                          </div>
                          <span>{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button onClick={() => navigate('/explorer')}
                    className="w-full py-2.5 text-xs font-medium text-gray-400 hover:text-primary transition-colors border border-gray-200 hover:border-primary/30 rounded-xl">
                    Réinitialiser les filtres
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </aside>

          {/* ── Résultats ───────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {status === 'loading' ? (
                  <span className="inline-block w-32 h-4 skeleton rounded" />
                ) : (
                  <>
                    <span className="font-semibold text-dark">{totalCount}</span>
                    {' '}établissement{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
                  </>
                )}
              </p>
              {currentCategorie && (
                <span className="text-xs text-primary bg-primary/8 border border-primary/20 px-3 py-1 rounded-full font-medium">
                  {CATEGORIES.find(c => c.id === currentCategorie)?.label}
                </span>
              )}
            </div>

            {status === 'loading' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <EstablishmentCardSkeleton key={i} />)}
              </div>
            ) : establishments.length === 0 ? (
              <EmptyResults query={currentQ} onReset={() => navigate('/explorer')} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {establishments.map((e, i) => (
                    <EstablishmentCard key={e.id} establishment={e} index={i} />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} pageSize={12} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyResults({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <Search className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-dark mb-2">
        {query ? `Aucun résultat pour "${query}"` : 'Aucun établissement trouvé'}
      </h3>
      <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
        Essayez d'autres mots-clés ou supprimez vos filtres pour explorer toutes les adresses.
      </p>
      <button onClick={onReset}
        className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
        Voir tous les établissements
      </button>
      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {[
          { label: 'Restaurants', id: 'restaurant' },
          { label: 'Bars', id: 'bar' },
          { label: 'Hôtels', id: 'hotel' },
          { label: 'Lounges', id: 'lounge' },
        ].map((cat) => (
          <Link key={cat.id} to={`/explorer?categorie=${cat.id}`}
            className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:text-primary bg-white transition-all">
            {cat.label}
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
