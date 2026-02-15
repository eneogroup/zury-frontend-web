'use client';

import { Star, User, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

export default function ReviewsSection({ rating, reviewCount, reviews }: ReviewsSectionProps) {
  const mockReviews: Review[] = reviews || [
    { 
      id: '1', 
      author: 'Marie K.', 
      rating: 5, 
      comment: 'Superbe endroit, cuisine excellente ! Le service est impeccable et l\'ambiance très agréable. Je recommande vivement !',
      date: 'Il y a 2 jours',
      helpful: 12
    },
    { 
      id: '2', 
      author: 'Jean P.', 
      rating: 4, 
      comment: 'Très bonne expérience, service rapide. Petit bémol sur le temps d\'attente mais le personnel était très sympathique.',
      date: 'Il y a 5 jours',
      helpful: 8
    },
    { 
      id: '3', 
      author: 'Carine M.', 
      rating: 5, 
      comment: 'Le meilleur resto de Brazza, j\'y viens toujours avec plaisir. Les plats sont délicieux et le cadre magnifique.',
      date: 'Il y a 1 semaine',
      helpful: 15
    },
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 80, count: Math.floor(reviewCount * 0.8) },
    { stars: 4, percentage: 12, count: Math.floor(reviewCount * 0.12) },
    { stars: 3, percentage: 5, count: Math.floor(reviewCount * 0.05) },
    { stars: 2, percentage: 2, count: Math.floor(reviewCount * 0.02) },
    { stars: 1, percentage: 1, count: Math.floor(reviewCount * 0.01) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-dark mb-6">Avis clients</h2>

      {/* Note globale et distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
        {/* Note moyenne */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-dark">{rating}</span>
            <span className="text-2xl text-gray">/5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(rating) ? 'fill-gold text-gold' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-gray">{reviewCount} avis vérifiés</p>
        </div>

        {/* Distribution des notes */}
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-dark">{item.stars}</span>
                <Star className="w-4 h-4 fill-gold text-gold" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gold rounded-full"
                />
              </div>
              <span className="text-sm text-gray w-12 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des avis */}
      <div className="space-y-6">
        {mockReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Header de l'avis */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-dark">{review.author}</p>
                    <p className="text-sm text-gray">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Commentaire */}
                <p className="text-gray leading-relaxed mb-3">{review.comment}</p>

                {/* Actions */}
                <button className="flex items-center gap-2 text-sm text-gray hover:text-primary transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Utile ({review.helpful})</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bouton voir tous les avis */}
      <button className="w-full mt-6 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-primary text-gray hover:text-primary font-medium transition-all">
        Voir tous les {reviewCount} avis
      </button>
    </motion.div>
  );
}