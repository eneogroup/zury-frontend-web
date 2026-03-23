import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Search, Navigation, Star, X, LocateFixed, Loader2 } from 'lucide-react'
import DI from '../../../di/ioc'

// Fix Leaflet default marker icons (Vite/webpack asset issue)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const BRAZZAVILLE_CENTER: [number, number] = [-4.2634, 15.2429]

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: 'bg-primary',
  bar:        'bg-gold',
  hotel:      'bg-blue-500',
  lounge:     'bg-purple-500',
}

const makeIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })

const ICONS: Record<string, L.DivIcon> = {
  restaurant: makeIcon('#E23007'),
  bar:        makeIcon('#F4A261'),
  hotel:      makeIcon('#3B82F6'),
  lounge:     makeIcon('#8B5CF6'),
}

// Fly map to a position
function FlyTo({ pos }: { pos: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (pos) map.flyTo(pos, 16, { duration: 1 })
  }, [pos, map])
  return null
}

export const CartePage = () => {
  const { establishments, status } = DI.resolve<any>('carteViewModel')
  const [searchQ, setSearchQ]               = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [flyTarget, setFlyTarget]           = useState<[number, number] | null>(null)
  const [geoLoading, setGeoLoading]         = useState(false)

  const locateMe = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false)
        setFlyTarget([pos.coords.latitude, pos.coords.longitude])
      },
      () => setGeoLoading(false),
      { timeout: 10000 }
    )
  }

  const filtered = establishments.filter((e: any) => {
    const matchQ   = !searchQ || e.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      e.neighborhood?.toLowerCase().includes(searchQ.toLowerCase())
    const matchCat = !selectedCategory || e.category === selectedCategory
    return matchQ && matchCat
  })

  const withCoords = filtered.filter((e: any) => e.latitude && e.longitude)

  const handleSelect = (e: any) => {
    if (e.latitude && e.longitude) {
      setFlyTarget([parseFloat(e.latitude), parseFloat(e.longitude)])
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.name + ' ' + e.neighborhood + ' Brazzaville')}`,
        '_blank'
      )
    }
  }

  const categories = [
    { id: '', label: 'Tous' },
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'bar', label: 'Bars' },
    { id: 'hotel', label: 'Hôtels' },
    { id: 'lounge', label: 'Lounges' },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="font-display text-xl font-semibold text-dark">
              Carte des établissements
            </h1>
            <p className="text-gray-400 text-xs hidden sm:block">
              Explorez tous les établissements de Brazzaville
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Rechercher..."
              className="bg-gray-50 border border-gray-200 text-dark placeholder-gray-400 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-52 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 items-center">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {c.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap pl-2">
          {filtered.length} établissement{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* List panel */}
        <div className="w-72 bg-white border-r border-gray-100 flex-col overflow-hidden hidden md:flex flex-shrink-0">

          {/* Search bar */}
          <div className="px-3 py-2.5 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Nom du restaurant, quartier…"
                className="w-full bg-gray-50 border border-gray-200 text-dark placeholder-gray-400 rounded-xl py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQ && (
                <button
                  onClick={() => setSearchQ('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            {searchQ && (
              <p className="text-[11px] text-gray-400 mt-1.5 pl-1">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''} pour «&nbsp;{searchQ}&nbsp;»
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {status === 'loading' ? (
              <div className="p-4 space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Aucun établissement trouvé</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((e: any) => (
                  <button key={e.id} onClick={() => handleSelect(e)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group text-left">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${CATEGORY_COLORS[e.category] || 'bg-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark text-sm truncate group-hover:text-primary transition-colors">
                        {e.name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">{e.neighborhood}</p>
                    </div>
                    <Navigation className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={BRAZZAVILLE_CENTER}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyTo pos={flyTarget} />

            {withCoords.map((e: any) => (
              <Marker
                key={e.id}
                position={[parseFloat(e.latitude), parseFloat(e.longitude)]}
                icon={ICONS[e.category] || ICONS.restaurant}
              >
                <Popup maxWidth={220} className="leaflet-popup-custom">
                  <div style={{ minWidth: 180 }}>
                    {e.imageUrl && (
                      <img
                        src={e.imageUrl}
                        alt={e.name}
                        style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                        onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#090909', marginBottom: 2 }}>{e.name}</p>
                    <p style={{ fontSize: 11, color: '#888', textTransform: 'capitalize', marginBottom: 4 }}>{e.category}</p>
                    {e.rating > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <span style={{ color: '#F4A261', fontSize: 12 }}>★</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#090909' }}>{e.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <p style={{ fontSize: 11, color: '#aaa', marginBottom: 8 }}>{e.neighborhood}</p>
                    <a
                      href={`/establishments/${e.id}`}
                      style={{
                        display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 600,
                        color: 'white', background: '#E23007', borderRadius: 6, padding: '6px 12px',
                        textDecoration: 'none',
                      }}
                    >
                      Voir le profil
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* GPS Locator */}
          <button
            onClick={locateMe}
            disabled={geoLoading}
            className="absolute top-4 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-dark hover:text-primary transition-all active:scale-95 border border-gray-100 disabled:opacity-75"
            title="Ma position"
          >
            {geoLoading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <LocateFixed className="w-5 h-5" />}
          </button>

          {/* Legend */}
          <div className="absolute bottom-6 right-4 bg-white rounded-xl p-3 shadow-md border border-gray-100 z-[1000]">
            <p className="text-xs font-semibold text-dark mb-2 uppercase tracking-wide">Légende</p>
            <div className="space-y-1.5">
              {[
                { color: 'bg-primary',    label: 'Restaurants' },
                { color: 'bg-gold',       label: 'Bars' },
                { color: 'bg-blue-500',   label: 'Hôtels' },
                { color: 'bg-purple-500', label: 'Lounges' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
            {withCoords.length < filtered.length && (
              <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-2">
                {filtered.length - withCoords.length} sans coordonnées
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
