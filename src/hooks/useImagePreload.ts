'use client';

import { useEffect, useState } from 'react';
import { preloadImage } from '@/lib/imageCache';

export function useImagePreload(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    preloadImage(src)
      .then(() => setIsLoaded(true))
      .catch(() => {
        setHasError(true);
        setIsLoaded(false);
      });
  }, [src]);

  return { isLoaded, hasError };
}