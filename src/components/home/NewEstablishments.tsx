import { cachedEstablishmentService } from '@/lib/cached-api';
import { transformEstablishmentList } from '@/lib/apiTransformers';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function NewEstablishmentsSection() {
  let newEstablishments = [];

  try {
    // Récupérer les établissements récents (30 derniers jours, max 4)
    const response = await cachedEstablishmentService.getRecent(30);
    const establishments = response.results || response || [];
    
    newEstablishments = establishments
      .map(transformEstablishmentList)
      .slice(0, 4);
  } catch (error) {
    console.error('Error loading new establishments:', error);
  }

  // Ne rien afficher si aucun établissement récent
  if (newEstablishments.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-bold text-dark">
                Nouveaux établissements
              </h2>
            </div>
            <p className="text-lg text-gray">
              Découvrez les dernières adresses ajoutées à ZURY
            </p>
          </div>

          {newEstablishments.length >= 4 && (
            <Link 
              href="/explorer?sort=recent" 
              className="hidden md:inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
            >
              Voir tous les nouveaux
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>

        {/* Grille d'établissements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newEstablishments.map((establishment, index) => (
            <div key={establishment.id} className="relative">
              {/* Badge "Nouveau" */}
              <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                NOUVEAU
              </div>
              
              <EstablishmentCard 
                establishment={establishment} 
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Lien mobile */}
        {newEstablishments.length >= 4 && (
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/explorer?sort=recent" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Voir tous les nouveaux
              <span>→</span>
            </Link>
          </div>
        )}

        {/* Message si peu d'établissements */}
        {newEstablishments.length > 0 && newEstablishments.length < 4 && (
          <p className="text-center text-gray mt-8">
            {newEstablishments.length === 1 
              ? "1 nouvel établissement ce mois-ci" 
              : `${newEstablishments.length} nouveaux établissements ce mois-ci`}
          </p>
        )}
      </div>
    </section>
  );
}