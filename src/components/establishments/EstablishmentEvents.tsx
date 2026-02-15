'use client';

import { Event } from '@/types';
import { Calendar, Ticket, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface EstablishmentEventsProps {
  events: Event[];
}

export default function EstablishmentEvents({ events }: EstablishmentEventsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-dark mb-4">
        Événements chez {events[0]?.establishment}
      </h2>
      
      <div className="space-y-4">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/evenements/${event.id}`}
            className="block group"
          >
            <div className="bg-light rounded-xl p-4 hover:bg-primary/5 transition-colors border border-gray-100 hover:border-primary/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-dark group-hover:text-primary transition-colors mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} · {event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ticket className="w-4 h-4" />
                      <span className="font-semibold text-primary">{event.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{event.availablePlaces}/{event.totalPlaces} places</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}