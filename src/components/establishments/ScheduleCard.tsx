'use client';

import { DaySchedule } from '@/types';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScheduleCardProps {
  schedule?: DaySchedule[];
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  const defaultSchedule: DaySchedule[] = [
    { day: 'Lundi', hours: '08h-23h', isToday: false },
    { day: 'Mardi', hours: '08h-23h', isToday: false },
    { day: 'Mercredi', hours: '08h-23h', isToday: true },
    { day: 'Jeudi', hours: '08h-23h', isToday: false },
    { day: 'Vendredi', hours: '08h-23h', isToday: false },
    { day: 'Samedi', hours: '08h-23h', isToday: false },
    { day: 'Dimanche', hours: '10h-22h', isToday: false },
  ];

  const displaySchedule = schedule || defaultSchedule;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-dark">Horaires</h3>
      </div>

      <div className="space-y-3">
        {displaySchedule.map((item) => (
          <div
            key={item.day}
            className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
              item.isToday 
                ? 'bg-primary/10 border border-primary/20' 
                : 'hover:bg-light'
            }`}
          >
            <span className={`font-medium ${item.isToday ? 'text-primary' : 'text-dark'}`}>
              {item.day}
              {item.isToday && (
                <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  Aujourd'hui
                </span>
              )}
            </span>
            <span className={`${item.isClosed ? 'text-red-500' : 'text-gray'} font-medium`}>
              {item.isClosed ? 'Fermé' : item.hours}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}