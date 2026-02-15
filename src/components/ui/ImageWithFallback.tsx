'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Placeholder basé sur le nom (première lettre)
  const getPlaceholder = () => {
    const firstLetter = alt.charAt(0).toUpperCase();
    const colors = ['#1E6FA8', '#28B463', '#F4C430', '#12243A'];
    const color = colors[firstLetter.charCodeAt(0) % colors.length];
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='120' fill='white'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getPlaceholder());
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        unoptimized={hasError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      onError={handleError}
      unoptimized={hasError}
    />
  );
}