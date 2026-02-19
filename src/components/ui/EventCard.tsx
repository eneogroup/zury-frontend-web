'use client';

import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Badge from './Badge';
import ImageWithFallback from './ImageWithFallback';
import FadeIn from './FadeIn';
import OptimizedImage from './OptimizedImage';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    category: string;
    date: string;
    time: string;
    establishment: string;
    price: string;
    availablePlaces: number;
    totalPlaces: number;
    imageUrl: string;
  };
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <FadeIn delay={index * 0.1}>
      <Link href={`/evenements/${event.id}`}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100/50 hover:border-primary/20 hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-40 w-full overflow-hidden">
            <OptimizedImage
              src={event.imageUrl || '/placeholder.svg'}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={index < 3} // Priorité pour les 3 premières images
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-3 left-3">
              <Badge variant="premium">{event.category}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
            
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{event.date} · {event.time}</span>
            </div>

            <div className="flex items-center text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{event.establishment}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-primary font-bold text-lg">{event.price}</span>
              <span className="text-sm text-gray-500">
                {event.availablePlaces}/{event.totalPlaces} places
              </span>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}