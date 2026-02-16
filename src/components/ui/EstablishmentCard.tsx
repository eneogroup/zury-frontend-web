'use client';

import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import Badge from './Badge';
import ImageWithFallback from './ImageWithFallback';
import FadeIn from './FadeIn';

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
        <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <ImageWithFallback
              src={establishment.imageUrl}
              alt={establishment.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            <div className="absolute top-3 right-3">
              <Badge variant={establishment.category}>{establishment.category}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {establishment.name}
            </h3>
            
            <div className="flex items-center text-gray text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{establishment.neighborhood}</span>
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
              <span className="ml-2 text-sm font-medium text-dark">
                {establishment.rating.toFixed(1)}/5
              </span>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}