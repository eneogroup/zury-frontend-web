'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  map: google.maps.Map;
}

export default function LocationButton({ map }: LocationButtonProps) {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        map.setCenter({ lat: latitude, lng: longitude });
        map.setZoom(15);

        // Ajouter un marker pour la position actuelle
        new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4F46E5',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          title: 'Votre position',
        });

        setIsLocating(false);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        alert('Impossible d\'obtenir votre position');
        setIsLocating(false);
      }
    );
  };

  return (
    <button
      onClick={handleLocate}
      disabled={isLocating}
      className="flex items-center gap-2 bg-white hover:bg-gray-50 text-dark font-semibold px-4 py-2 rounded-lg shadow-lg transition-all disabled:opacity-50"
    >
      <MapPin className="w-5 h-5" />
      {isLocating ? 'Localisation...' : 'Ma position'}
    </button>
  );
}