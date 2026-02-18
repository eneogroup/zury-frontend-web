import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne 1 - À propos */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">ZURY</h3>
            <p className="text-white/70 mb-4 leading-relaxed">
              Votre guide pour découvrir les meilleurs restaurants, bars, hôtels et événements de Brazzaville et Pointe-Noire.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 - Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="text-white/70 hover:text-primary transition-colors">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/evenements" className="text-white/70 hover:text-primary transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/carte" className="text-white/70 hover:text-primary transition-colors">
                  Carte
                </Link>
              </li>
              <li>
                <Link href="/rejoindre-zury" className="block text-white/70 hover:text-primary transition-colors">
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <Link href="/eneo-academy" className="block text-white/70 hover:text-primary transition-colors">
                  Eneo Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Catégories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Catégories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/explorer?category=restaurant" className="text-white/70 hover:text-primary transition-colors">
                  🍽️ Restaurants
                </Link>
              </li>
              <li>
                <Link href="/explorer?category=bar" className="text-white/70 hover:text-primary transition-colors">
                  🍹 Bars
                </Link>
              </li>
              <li>
                <Link href="/explorer?category=hotel" className="text-white/70 hover:text-primary transition-colors">
                  🏨 Hôtels
                </Link>
              </li>
              <li>
                <Link href="/explorer?category=lounge" className="text-white/70 hover:text-primary transition-colors">
                  🎵 Lounges
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <span>Brazzaville & Pointe-Noire, République du Congo</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Phone className="w-5 h-5 flex-shrink-0 text-primary" />
                <a href="tel:+242123456789" className="hover:text-primary transition-colors">
                  +242 06 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="w-5 h-5 flex-shrink-0 text-primary" />
                <a href="mailto:contact@zury.cg" className="hover:text-primary transition-colors">
                  contact@zury.cg
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            {/* <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-white">Newsletter</h5>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  OK
                </button>
              </form>
            </div> */}
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-white/10"></div>

      {/* Section inférieure 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            © {currentYear} ZURY - Tous droits réservés
          </p>
          
          {/* <div className="flex items-center gap-6 text-sm">
            <Link href="/mentions-legales" className="text-white/60 hover:text-primary transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-white/60 hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <Link href="/cgu" className="text-white/60 hover:text-primary transition-colors">
              CGU
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-primary transition-colors">
              Contact
            </Link>
          </div> 
        </div>
      </div>
      */}

      {/* Badge "Made with ❤️" */}
      <div className="bg-dark/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-white/40 text-xs">
            Créé avec ❤️ par Eneo Academy · Academy de Formation en Informatique du Congo 🇨🇬
          </p>
          <p className="text-white/40 text-center text-xs mt-2">
            © {currentYear} ZURY - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}