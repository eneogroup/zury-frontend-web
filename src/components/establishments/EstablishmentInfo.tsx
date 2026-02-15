'use client';

import { Establishment } from '@/types';
import { motion } from 'framer-motion';

interface EstablishmentInfoProps {
  establishment: Establishment;
}

export default function EstablishmentInfo({ establishment }: EstablishmentInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-dark mb-4">À propos</h2>
      <p className="text-gray leading-relaxed text-lg">
        {establishment.description || 
          `${establishment.name} est un ${establishment.category} situé à ${establishment.neighborhood}, Brazzaville. Venez découvrir une expérience unique dans un cadre chaleureux et convivial.`
        }
      </p>
    </motion.div>
  );
}