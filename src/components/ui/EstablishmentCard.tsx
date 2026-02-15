import { Establishment } from '@/types';
import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Badge from './Badge';

interface EstablishmentCardProps {
  establishment: Establishment;
}

export default function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  return (
    <Link href={`/establishments/${establishment.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={establishment.imageUrl}
            alt={establishment.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={establishment.category}>{establishment.category}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
            {establishment.name}
          </h3>
          
          <div className="flex items-center text-gray text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{establishment.neighborhood}</span>
          </div>

          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.floor(establishment.rating) 
                      ? 'fill-gold text-gold' 
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-dark">
              {establishment.rating}/5
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}