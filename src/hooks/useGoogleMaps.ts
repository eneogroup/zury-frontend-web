'use client';

import { useEffect, useState } from 'react';

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadMaps = async () => {
      try {
        // Utiliser le nouveau functional API de Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setIsLoaded(true);
          console.log('✅ Google Maps loaded successfully');
        };

        script.onerror = () => {
          const error = new Error('Failed to load Google Maps');
          setLoadError(error);
          console.error('❌ Error loading Google Maps:', error);
        };

        document.head.appendChild(script);
      } catch (error) {
        setLoadError(error as Error);
        console.error('❌ Error loading Google Maps:', error);
      }
    };

    loadMaps();
  }, []);

  return { 
    isLoaded, 
    loadError, 
    google: typeof window !== 'undefined' && isLoaded ? (window as any).google : null 
  };
}