'use client';

import { MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationCardProps {
  address: string;
  neighborhood: string;
  latitude?: number;
  longitude?: number;
}

export default function LocationCard({ 
  address, 
  neighborhood, 
  latitude, 
  longitude 
}: LocationCardProps) {
  const openInMaps = () => {
    if (latitude && longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        '_blank'
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-bold text-dark mb-4">Localisation</h3>

      {/* Adresse */}
      <div className="flex items-start gap-3 mb-4">
        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="text-dark font-medium">{address}</p>
          <p className="text-gray text-sm">{neighborhood}, Brazzaville</p>
        </div>
      </div>

      {/* Carte placeholder */}
      <div className="relative bg-light rounded-xl overflow-hidden h-48 mb-4 border border-gray-100">
        {latitude && longitude ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-gray text-sm">Carte interactive</p>
              <p className="text-xs text-gray mt-1">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray">Localisation non disponible</p>
          </div>
        )}
      </div>

      {/* Bouton ouvrir dans Maps */}
      {latitude && longitude && (
        <button
          onClick={openInMaps}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir dans Google Maps
        </button>
      )}
    </motion.div>
  );
}