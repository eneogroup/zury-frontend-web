import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Badge from './Badge';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="premium">{event.category}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          <div className="flex items-center text-gray text-sm mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{event.date} · {event.time}</span>
          </div>

          <div className="flex items-center text-gray text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{event.establishment}</span>
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
  );
}