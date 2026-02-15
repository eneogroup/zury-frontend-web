'use client';

import { useState } from 'react';
import { Establishment } from '@/types';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import { MapPin, Locate } from 'lucide-react';
import Button from '@/components/ui/Button';

interface MapViewProps {
  establishments: Establishment[];
}

export default function MapView({ establishments }: MapViewProps) {
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);

  // Centre par défaut (Brazzaville)
  const defaultCenter = {
    lat: -4.2634,
    lng: 15.2429,
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      restaurant: '#1E6FA8',
      bar: '#F4C430',
      hotel: '#28B463',
      lounge: '#12243A',
    };
    return colors[category] || '#1E6FA8';
  };

  return (
    <div className="relative w-full h-[calc(100vh-200px)] flex gap-4">
      {/* Carte (placeholder) */}
      <div className="flex-1 bg-gray-200 rounded-lg relative overflow-hidden">
        {/* En attendant l'intégration Google Maps */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              Carte Google Maps
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Intégration avec Google Maps API
            </p>
          </div>
        </div>

        {/* Bouton localisation */}
        <Button
          variant="primary"
          className="absolute bottom-4 right-4 flex items-center gap-2 shadow-lg"
        >
          <Locate className="w-4 h-4" />
          Me localiser
        </Button>

        {/* Légende */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-dark mb-3">Légende</h3>
          <div className="space-y-2">
            {['restaurant', 'bar', 'hotel', 'lounge'].map((category) => (
              <div key={category} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
                <span className="text-sm capitalize">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel latéral avec la liste */}
      <div className="w-80 bg-white rounded-lg shadow-lg overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-dark text-lg">
            {establishments.length} établissements
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {establishments.map((establishment) => (
            <div 
              key={establishment.id}
              onClick={() => setSelectedEstablishment(establishment)}
              className="cursor-pointer"
            >
              <EstablishmentCard establishment={establishment} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}