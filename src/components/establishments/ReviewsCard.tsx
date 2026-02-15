import { Star, User } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date?: string;
}

interface ReviewsCardProps {
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

export default function ReviewsCard({ rating, reviewCount, reviews }: ReviewsCardProps) {
  const mockReviews: Review[] = reviews || [
    { id: '1', author: 'Marie K.', rating: 5, comment: 'Superbe endroit, cuisine excellente !' },
    { id: '2', author: 'Jean P.', rating: 4, comment: 'Très bonne expérience, service rapide.' },
    { id: '3', author: 'Carine M.', rating: 5, comment: 'Le meilleur resto de Brazza, j\'y viens toujours !' },
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold text-dark mb-6">Avis clients</h3>

      {/* Note globale */}
      <div className="flex items-center gap-8 mb-6 pb-6 border-b">
        <div className="text-center">
          <div className="text-5xl font-bold text-dark mb-2">{rating}</div>
          <div className="flex items-center justify-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(rating) ? 'fill-gold text-gold' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray">{reviewCount} avis vérifiés</p>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="text-sm text-dark w-8">{item.stars}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray w-10">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-dark">{review.author}</p>
                <div className="flex items-center">
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
            </div>
            <p className="text-gray">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}