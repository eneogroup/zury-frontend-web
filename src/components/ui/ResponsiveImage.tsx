'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  className?: string;
  priority?: boolean;
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
};

export default function ResponsiveImage({
  src,
  alt,
  aspectRatio = 'landscape',
  className = '',
  priority = false,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${aspectRatios[aspectRatio]} ${className} overflow-hidden bg-gray-200`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`object-cover transition-all duration-700 ${
          isLoading ? 'blur-lg scale-110' : 'blur-0 scale-100'
        }`}
        onLoad={() => setIsLoading(false)}
      />
      
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}
    </div>
  );
}