'use client';

import Badge from '@/components/ui/Badge';
import { Star, Verified } from 'lucide-react';
import { motion } from 'framer-motion';

interface EstablishmentHeaderProps {
  establishment: {
    name: string;
    category: 'restaurant' | 'bar' | 'hotel' | 'lounge';
    rating: number;
    reviewCount: number;
    isOpen?: boolean;
    isPremium?: boolean;
  };
}

export default function EstablishmentHeader({ establishment }: EstablishmentHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-3">
          {establishment.name}
        </h1>
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={establishment.category}>
            {establishment.category}
          </Badge>
          {establishment.isOpen !== undefined && (
            <Badge variant={establishment.isOpen ? 'open' : 'closed'}>
              {establishment.isOpen ? 'Ouvert' : 'Fermé'}
            </Badge>
          )}
          {establishment.isPremium && (
            <Badge variant="premium" className="flex items-center gap-1">
              <Verified className="w-3 h-3" />
              Premium
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-gold text-gold" />
            <span className="text-2xl font-bold text-dark">
              {establishment.rating.toFixed(1)}
            </span>
            <span className="text-gray">/5</span>
          </div>
          <span className="text-gray">
            {establishment.reviewCount} avis vérifiés
          </span>
        </div>
      </div>
    </motion.div>
  );
}