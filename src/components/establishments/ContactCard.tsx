'use client';

import { Phone, Navigation, Share2, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ContactCardProps {
  establishment: {
    phone?: string;
    hours?: string;
    isOpen?: boolean;
    latitude?: number;
    longitude?: number;
    name?: string;
  };
}

export default function ContactCard({ establishment }: ContactCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCall = () => {
    if (establishment.phone) {
      window.location.href = `tel:${establishment.phone}`;
    }
  };

  const handleDirections = () => {
    if (establishment.latitude && establishment.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${establishment.latitude},${establishment.longitude}`,
        '_blank'
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: establishment.name || 'Établissement',
          text: `Découvrez cet établissement sur Zury`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28"
    >
      <h3 className="text-xl font-bold text-dark mb-4">Contact</h3>

      {/* Téléphone */}
      {establishment.phone && (
        <div className="mb-4">
          <p className="text-sm text-gray mb-1">Téléphone</p>
          <p className="text-dark font-medium">{establishment.phone}</p>
        </div>
      )}

      {/* Horaires rapide */}
      {establishment.hours && (
        <div className="mb-4">
          <p className="text-sm text-gray mb-1">Horaires</p>
          <p className="text-dark font-medium">{establishment.hours}</p>
          {establishment.isOpen !== undefined && (
            <p className={`text-sm font-semibold mt-1 ${establishment.isOpen ? 'text-accent' : 'text-red-500'}`}>
              {establishment.isOpen ? '● OUVERT' : '● FERMÉ'}
            </p>
          )}
        </div>
      )}

      {/* Boutons d'action */}
      <div className="space-y-3 mt-6">
        {establishment.phone && (
          <Button
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleCall}
          >
            <Phone className="w-4 h-4" />
            Appeler maintenant
          </Button>
        )}

        {establishment.latitude && establishment.longitude && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleDirections}
          >
            <Navigation className="w-4 h-4" />
            Voir l'itinéraire
          </Button>
        )}

        {/* Actions secondaires */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              isFavorite
                ? 'border-red-500 bg-red-50 text-red-500'
                : 'border-gray-200 hover:border-primary/30 text-gray hover:text-primary'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-primary/30 text-gray hover:text-primary transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}