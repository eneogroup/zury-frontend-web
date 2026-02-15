'use client';

import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Badge from './Badge';
import ImageWithFallback from './ImageWithFallback';
import FadeIn from './FadeIn';

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <FadeIn delay={index * 0.1}>
      <Link href={`/evenements/${event.id}`}>
        <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
          {/* Image */}
          <div className="relative h-40 w-full overflow-hidden">
            <ImageWithFallback
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="premium">{event.category}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
            
            <div className="flex items-center text-gray text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{event.date} · {event.time}</span>
            </div>

            <div className="flex items-center text-gray text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{event.establishment}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-primary font-bold">{event.price}</span>
              <span className="text-sm text-gray">
                {event.availablePlaces}/{event.totalPlaces} places
              </span>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}