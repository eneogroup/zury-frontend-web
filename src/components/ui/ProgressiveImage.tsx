'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  lowQualitySrc?: string; // Version basse qualité pour le chargement
}

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  sizes,
  lowQualitySrc,
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!lowQualitySrc) {
      setIsLoading(false);
      return;
    }

    // Précharger l'image haute qualité
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
  }, [src, lowQualitySrc]);

  return (
    <div className={cn('relative', className)}>
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        className={cn(
          'transition-all duration-500',
          isLoading && 'blur-md scale-105',
          !isLoading && 'blur-0 scale-100'
        )}
      />
    </div>
  );
}