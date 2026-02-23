import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/evenements', label: 'Événements' },
  { to: '/carte', label: 'Carte' },
  { to: '/rejoindre-zury', label: 'Devenir partenaire' },
  { to: '/eneo-academy', label: 'Eneo Academy' },
]

const categories = [
  { to: '/explorer?categorie=restaurant', label: 'Restaurants' },
  { to: '/explorer?categorie=bar', label: 'Bars & Lounges' },
  { to: '/explorer?categorie=hotel', label: 'Hôtels' },
  { to: '/evenements', label: 'Événements' },
]

const socialLinks = [
  { href: 'https://facebook.com', label: 'Fb' },
  { href: 'https://instagram.com', label: 'Ig' },
  { href: 'https://twitter.com', label: 'Tw' },
  { href: 'https://youtube.com', label: 'Yt' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark relative overflow-hidden">
      {/* Ember glow accents */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-0.5 mb-4">
              <span className="font-display text-3xl font-bold text-white tracking-tight">ZURY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Le guide de référence pour découvrir les meilleurs restaurants,
              bars, hôtels et événements de Brazzaville et Pointe-Noire.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ href, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 hover:border-primary/60 hover:bg-primary/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 text-xs font-semibold">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white/90 text-xs font-semibold uppercase tracking-ultrawide mb-6">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/40 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white/90 text-xs font-semibold uppercase tracking-ultrawide mb-6">Catégories</h4>
            <ul className="space-y-3">
              {categories.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/40 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/90 text-xs font-semibold uppercase tracking-ultrawide mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/40 text-sm">Brazzaville & Pointe-Noire<br />République du Congo</span>
              </li>
              <li>
                <a href="tel:+242061234567" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors text-sm group">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  +242 06 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:contact@zury.cg" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors text-sm group">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  contact@zury.cg
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © {currentYear} ZURY — Tous droits réservés
          </p>
          <p className="text-white/20 text-xs">
            Créé par{' '}
            <Link to="/eneo-academy" className="text-white/40 hover:text-primary transition-colors">
              Eneo Academy
            </Link>
            {' '}· République du Congo 🇨🇬
          </p>
        </div>
      </div>
    </footer>
  )
}
