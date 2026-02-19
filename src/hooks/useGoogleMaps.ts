'use client';

import { useEffect, useState } from 'react';

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Vérifier périodiquement si Google Maps est chargé
    const checkGoogle = () => {
      if (window.google?.maps) {
        setIsLoaded(true);
        console.log('✅ Google Maps is ready');
        return true;
      }
      return false;
    };

    // Vérifier immédiatement
    if (checkGoogle()) return;

    // Sinon, vérifier toutes les 100ms
    const interval = setInterval(() => {
      if (checkGoogle()) {
        clearInterval(interval);
      }
    }, 100);

    // Timeout après 10 secondes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!window.google?.maps) {
        console.error('❌ Google Maps failed to load');
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return {
    isLoaded,
    loadError: null,
    google: typeof window !== 'undefined' && isLoaded ? window.google : null,
  };
}