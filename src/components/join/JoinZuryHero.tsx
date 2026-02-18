'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import RegistrationModal from './RegistrationModal';

export default function JoinZuryHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-gradient-to-br from-dark via-dark/95 to-primary/20 text-white py-20 overflow-hidden">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Développez votre visibilité avec{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold">
                ZURY
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Rejoignez la première plateforme HoReCa du Congo
            </p>
            
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Des milliers d'utilisateurs recherchent quotidiennement les meilleurs restaurants, 
              bars, hôtels et événements à Brazzaville et Pointe-Noire. 
              Soyez visible, soyez trouvé, développez votre clientèle !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="text-lg px-8 py-4 shadow-2xl hover:shadow-primary/50 transition-all"
              >
                Inscrire mon établissement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-dark"
              >
                En savoir plus
              </Button>
            </div>

            {/* Badge gratuit */}
            <div className="mt-8 inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-6 py-3">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-accent font-semibold">100% Gratuit • Inscription en 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal d'inscription */}
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}