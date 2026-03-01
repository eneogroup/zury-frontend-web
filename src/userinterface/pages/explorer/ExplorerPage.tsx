import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowUpDown,
  MapPin,
  ArrowRight,
  Heart,
  Clock,
  Gift,
  CalendarDays,
  Tag,
  Award,
  Navigation,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DI from "../../../di/ioc";
import EstablishmentCard from "../shared/ui/EstablishmentCard";
import EstablishmentCardSkeleton from "../shared/ui/EstablishmentCardSkeleton";
import Pagination from "../shared/ui/Pagination";
import type { IExplorerViewModel } from "../../../service/interface/explorer.viewmodel.interface";
import { useFavorites } from "../../../service/hooks/useFavorites";

const CATEGORIES = [
  { id: "", label: "Tous", dot: "bg-gray-300" },
  { id: "restaurant", label: "Restaurants", dot: "bg-primary" },
  { id: "bar", label: "Bars", dot: "bg-gold" },
  { id: "hotel", label: "Hôtels", dot: "bg-blue-400" },
  { id: "lounge", label: "Lounges", dot: "bg-purple-400" },
];

const QUICK_FILTERS = [
  {
    id: "ouvert",
    label: "Ouvert maintenant",
    Icon: Clock,
    activeClass: "bg-green-500 text-white border-green-500",
    hoverClass: "hover:border-green-300 hover:text-green-700 hover:bg-green-50",
  },

  {
    id: "pas cher",
    label: "Pas cher",
    Icon: Tag,
    activeClass: "bg-orange-500 text-white border-orange-500",
    hoverClass:
      "hover:border-orange-300 hover:text-orange-700 hover:bg-orange-50",
  },

  {
    id: "luxe",
    label: "Luxe",
    Icon: Award,
    activeClass: "bg-purple-500 text-white border-purple-500",
    hoverClass:
      "hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50",
  },
  {
    id: "proche",
    label: "Proche de moi",
    Icon: Navigation,
    activeClass: "bg-primary text-white border-primary",
    hoverClass: "hover:border-primary/40 hover:text-primary hover:bg-primary/5",
  },
];

const RATINGS = [
  { value: "4", label: "4★ et plus" },
  { value: "3", label: "3★ et plus" },
  { value: "2", label: "2★ et plus" },
  { value: "", label: "Toutes les notes" },
];

const ORDERING_OPTIONS = [
  { value: "", label: "Par défaut" },
  { value: "-note_moyenne", label: "Meilleure note" },
  { value: "-nombre_vues", label: "Plus populaires" },
  { value: "-created_at", label: "Plus récents" },
  { value: "nom", label: "Alphabétique (A→Z)" },
];

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "bg-primary/10 text-primary border-primary/20",
  bar: "bg-yellow-50 text-yellow-700 border-yellow-200",
  hotel: "bg-blue-50 text-blue-600 border-blue-200",
  lounge: "bg-purple-50 text-purple-600 border-purple-200",
};

export const ExplorerPage = () => {
  const { establishments, quartiers, status, totalCount, totalPages } =
    DI.resolve<IExplorerViewModel>("explorerViewModel");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [geoLoading, setGeoLoading] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentCategorie = searchParams.get("categorie") || "";
  const currentNeighborhood = searchParams.get("neighborhood") || "";
  const currentMinRating = searchParams.get("minRating") || "";
  const currentOrdering = searchParams.get("ordering") || "";
  const currentQ = searchParams.get("q") || "";
  const currentQuickFilter = searchParams.get("quickFilter") || "";
  const hasActiveFilters = !!(
    currentCategorie ||
    currentNeighborhood ||
    currentMinRating ||
    currentQ ||
    currentOrdering ||
    currentQuickFilter
  );

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) =>
      v ? params.set(k, v) : params.delete(k),
    );
    params.delete("page");
    navigate(`?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput });
  };

  const toggleQuickFilter = (filterId: string) => {
    if (filterId === currentQuickFilter) {
      // Toggle off — clear quickFilter + geolocation params
      const p = new URLSearchParams(searchParams);
      p.delete("quickFilter");
      p.delete("lat");
      p.delete("lng");
      p.delete("page");
      navigate(`?${p.toString()}`);
      return;
    }

    if (filterId === "proche") {
      if (!navigator.geolocation) {
        // No geolocation support, still apply the filter
        updateParams({ quickFilter: "proche" });
        return;
      }
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLoading(false);
          const p = new URLSearchParams(searchParams);
          p.set("quickFilter", "proche");
          p.set("lat", pos.coords.latitude.toString());
          p.set("lng", pos.coords.longitude.toString());
          p.delete("page");
          navigate(`?${p.toString()}`);
        },
        () => {
          setGeoLoading(false);
          updateParams({ quickFilter: "proche" });
        },
        { timeout: 10000 },
      );
      return;
    }

    // Switching to another quick filter — clear stale geolocation
    const p = new URLSearchParams(searchParams);
    p.set("quickFilter", filterId);
    p.delete("lat");
    p.delete("lng");
    p.delete("page");
    navigate(`?${p.toString()}`);
  };

  const currentOrderingLabel =
    ORDERING_OPTIONS.find((o) => o.value === currentOrdering)?.label || "Trier";

  const activeQuickFilterLabel = QUICK_FILTERS.find(
    (f) => f.id === currentQuickFilter,
  )?.label;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Brazzaville & Pointe-Noire
          </p>

          <div className="mb-8">
            {currentQ ? (
              <h1 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight">
                Résultats pour{" "}
                <span className="text-primary italic">"{currentQ}"</span>
              </h1>
            ) : activeQuickFilterLabel ? (
              <h1 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight">
                <span className="text-primary italic">
                  {activeQuickFilterLabel}
                </span>{" "}
                à Brazzaville
              </h1>
            ) : (
              <h1 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight">
                Explorer{" "}
                <span className="text-primary italic">Brazzaville</span>
              </h1>
            )}
            <span className="accent-bar mt-3" />
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ex: mami wata · poto-poto · restaurant:poto-poto · bar:ouvert"
                className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 text-dark placeholder-gray-400 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateParams({ q: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md"
            >
              Rechercher
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-4 rounded-xl border transition-all lg:hidden ${
                showFilters || hasActiveFilters
                  ? "bg-primary/5 border-primary/30 text-primary"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </form>

          {/* Category chips */}
          <div className="flex gap-2 flex-wrap mb-3">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategorie === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => updateParams({ categorie: cat.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white/60" : cat.dot}`}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick filter chips */}
          <div className="flex gap-2 flex-wrap">
            {QUICK_FILTERS.map((qf) => {
              const isActive = currentQuickFilter === qf.id;
              const isLoadingThis = geoLoading && qf.id === "proche";
              return (
                <button
                  key={qf.id}
                  onClick={() => toggleQuickFilter(qf.id)}
                  disabled={geoLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                    isActive
                      ? `${qf.activeClass} shadow-sm`
                      : `bg-white text-gray-500 border-gray-200 ${qf.hoverClass}`
                  }`}
                >
                  {isLoadingThis ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <qf.Icon className="w-3 h-3" />
                  )}
                  {qf.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={() => navigate("/explorer")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-primary hover:border-primary/30 transition-all"
              >
                <X className="w-3 h-3" />
                Effacer tout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-dark text-sm font-semibold uppercase tracking-widest">
                    Filtres
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-400 hover:text-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">
                    Trier par
                  </p>
                  <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <select
                      value={currentOrdering}
                      onChange={(e) =>
                        updateParams({ ordering: e.target.value })
                      }
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl pl-9 pr-8 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                    >
                      {ORDERING_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Quartier */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">
                    Quartier
                  </p>
                  <div className="relative">
                    <select
                      value={currentNeighborhood}
                      onChange={(e) =>
                        updateParams({ neighborhood: e.target.value })
                      }
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                    >
                      <option value="">Tous les quartiers</option>
                      {quartiers.map((q: any) => (
                        <option key={q.value} value={q.value}>
                          {q.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Note minimum */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">
                    Note minimum
                  </p>
                  <div className="space-y-1">
                    {RATINGS.map(({ value, label }) => {
                      const isActive = currentMinRating === value;
                      return (
                        <button
                          key={value}
                          onClick={() => updateParams({ minRating: value })}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                            isActive
                              ? "bg-primary/8 text-primary border border-primary/20"
                              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                          }`}
                        >
                          <div className="flex gap-0.5">
                            {value ? (
                              [...Array(parseInt(value))].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${isActive ? "fill-primary text-primary" : "fill-gold text-gold"}`}
                                />
                              ))
                            ) : (
                              <Star className="w-3 h-3 text-gray-300" />
                            )}
                          </div>
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => navigate("/explorer")}
                    className="w-full py-2.5 text-xs font-medium text-gray-400 hover:text-primary transition-colors border border-gray-200 hover:border-primary/30 rounded-xl"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {status === "loading" ? (
                  <span className="inline-block w-32 h-4 skeleton rounded" />
                ) : (
                  <>
                    <span className="font-semibold text-dark">
                      {totalCount}
                    </span>{" "}
                    établissement{totalCount > 1 ? "s" : ""} trouvé
                    {totalCount > 1 ? "s" : ""}
                    {currentOrdering && (
                      <span className="ml-2 text-primary font-medium">
                        · {currentOrderingLabel}
                      </span>
                    )}
                    {currentQuickFilter && (
                      <span className="ml-2 text-primary font-medium">
                        · {activeQuickFilterLabel}
                      </span>
                    )}
                  </>
                )}
              </p>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:text-dark"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:text-dark"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {status === "loading" ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <EstablishmentCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse"
                    />
                  ))}
                </div>
              )
            ) : establishments.length === 0 ? (
              <EmptyResults
                query={currentQ}
                onReset={() => navigate("/explorer")}
              />
            ) : viewMode === "grid" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {establishments.map((e, i) => (
                    <EstablishmentCard
                      key={e.id}
                      establishment={e}
                      index={i}
                      showOpenStatus
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={12}
                />
              </>
            ) : (
              <>
                <div className="space-y-3">
                  {establishments.map((e, i) => (
                    <EstablishmentListRow
                      key={e.id}
                      establishment={e}
                      index={i}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={12}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── List row component ─────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  string,
  { dot: string; label: string; color: string }
> = {
  restaurant: { dot: "bg-primary", label: "Restaurant", color: "text-primary" },
  bar: { dot: "bg-gold", label: "Bar", color: "text-yellow-700" },
  hotel: { dot: "bg-blue-500", label: "Hôtel", color: "text-blue-600" },
  lounge: { dot: "bg-purple-500", label: "Lounge", color: "text-purple-600" },
};

function EstablishmentListRow({
  establishment,
  index,
}: {
  establishment: any;
  index: number;
}) {
  const cfg =
    CATEGORY_CONFIG[establishment.category] ?? CATEGORY_CONFIG.restaurant;
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(establishment.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link to={`/establishments/${establishment.id}`} className="block group">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={
                  establishment.imageUrl ||
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80"
                }
                alt={establishment.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80";
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-dark group-hover:text-primary transition-colors truncate">
                  {establishment.name}
                </h3>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  <span className="text-xs font-semibold text-dark">
                    {establishment.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span
                  className={`flex items-center gap-1 font-medium ${cfg.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {establishment.neighborhood}
                </span>
                {establishment.isPremium && (
                  <span className="bg-gold/20 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  toggleFavorite({
                    id: establishment.id,
                    type: "establishment",
                    name: establishment.name,
                    imageUrl: establishment.imageUrl,
                    subtitle: establishment.neighborhood,
                    savedAt: Date.now(),
                  });
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${fav ? "bg-red-500 text-white" : "bg-gray-50 text-gray-400 hover:text-red-400"}`}
              >
                <Heart className={`w-3.5 h-3.5 ${fav ? "fill-white" : ""}`} />
              </button>
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-400 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyResults({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-20 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <Search className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-dark mb-2">
        {query
          ? `Aucun résultat pour "${query}"`
          : "Aucun établissement trouvé"}
      </h3>
      <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
        Essayez d'autres mots-clés ou supprimez vos filtres pour explorer toutes
        les adresses.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
      >
        Voir tous les établissements
      </button>
      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {[
          { label: "Restaurants", id: "restaurant" },
          { label: "Bars", id: "bar" },
          { label: "Hôtels", id: "hotel" },
          { label: "Lounges", id: "lounge" },
        ].map((cat) => (
          <Link
            key={cat.id}
            to={`/explorer?categorie=${cat.id}`}
            className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:text-primary bg-white transition-all"
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
