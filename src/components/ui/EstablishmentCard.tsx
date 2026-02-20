'use client';

import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import Badge from './Badge';
import ImageWithFallback from './ImageWithFallback';
import FadeIn from './FadeIn';
import OptimizedImage from './OptimizedImage';

interface EstablishmentCardProps {
  establishment: {
    id: string;
    name: string;
    category: 'restaurant' | 'bar' | 'hotel' | 'lounge';
    address: string;
    neighborhood: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    isPremium?: boolean;
  };
  index?: number;
}

export default function EstablishmentCard({ establishment, index = 0 }: EstablishmentCardProps) {
  return (
    <FadeIn delay={index * 0.1}>
      <Link href={`/establishments/${establishment.id}`}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100/50 hover:border-primary/20 hover:-translate-y-1">
          {/* Image */}
          <div className="relative  w-full overflow-hidden">
            <OptimizedImage
              src={establishment.imageUrl || '/placeholder.svg'}
              alt={establishment.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={index < 3} // Priorité pour les 3 premières images
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-3 right-3">
              <Badge variant={establishment.category}>{establishment.category}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {establishment.name}
            </h3>
            
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{establishment.neighborhood}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <span className="line-clamp-1">{establishment.address}</span>
            </div>

            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(establishment.rating) 
                        ? 'fill-gold text-gold' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-semibold text-dark">
                {establishment.rating.toFixed(1)}/5
              </span>
              <span className="ml-1 text-sm text-gray-500">
                ({establishment.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}