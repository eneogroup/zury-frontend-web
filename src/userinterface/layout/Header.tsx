import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Heart } from 'lucide-react'
import { cn } from '../../service/utils/cn'
import { useFavorites } from '../../service/hooks/useFavorites'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Explorer', href: '/explorer' },
  { name: 'Événements', href: '/evenements' },
  { name: 'Carte', href: '/carte' },
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { favorites } = useFavorites()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explorer?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  const headerBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-dark/95 backdrop-blur-xl border-b border-white/5'

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      headerBg
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="ZURY" className="h-16 w-16 rounded-xl object-contain" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg',
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Desktop search */}
            <div className={cn(
              'hidden md:flex items-center gap-2 transition-all duration-300 overflow-hidden',
              searchOpen ? 'w-64' : 'w-10'
            )}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center w-full glass-dark rounded-full px-4 py-2">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Favorites button */}
            <Link
              to="/favoris"
              className={cn(
                'hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all relative',
                location.pathname === '/favoris'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Heart className={cn('w-4 h-4', location.pathname === '/favoris' && 'fill-red-400')} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* CTA button */}
            <Link
              to="/rejoindre-zury"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-ember"
            >
              Rejoindre
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full glass-dark text-white placeholder-white/40 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none"
              />
            </form>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)}
                  className={cn('block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    location.pathname === item.href ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}>
                  {item.name}
                </Link>
              ))}
              <Link to="/favoris" onClick={() => setMobileMenuOpen(false)}
                className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  location.pathname === '/favoris' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}>
                <Heart className="w-4 h-4" />
                Mes favoris
                {favorites.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
