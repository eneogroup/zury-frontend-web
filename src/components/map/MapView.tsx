'use client';

import { useState } from 'react';
import GoogleMap from './GoogleMap';
import LocationButton from './LocationButton';

export default function MapView() {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = (loadedMap: google.maps.Map) => {
    setMap(loadedMap);
    console.log('✅ Map loaded successfully');
  };

  return (
    <div className="relative w-full h-full">
      <GoogleMap onMapLoad={handleMapLoad} className="w-full h-full" />
      
      {/* Bouton de localisation */}
      {map && (
        <div className="absolute top-4 left-4 z-10">
          <LocationButton map={map} />
        </div>
      )}
    </div>
  );
}