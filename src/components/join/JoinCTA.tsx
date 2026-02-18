'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import RegistrationModal from './RegistrationModal';

export default function JoinCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-dark via-primary/10 to-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à développer votre visibilité ?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Rejoignez dès maintenant les établissements leaders de Brazzaville et Pointe-Noire
          </p>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="text-lg px-10 py-5 shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all"
          >
            Rejoindre ZURY maintenant
          </Button>

          <p className="mt-6 text-white/60 text-sm">
            Inscription 100% gratuite • Sans engagement • Validation sous 48h
          </p>
        </div>
      </section>

      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}