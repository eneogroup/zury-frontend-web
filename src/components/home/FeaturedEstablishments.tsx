import EstablishmentCard from '@/components/ui/EstablishmentCard';
import { Establishment } from '@/types';

interface FeaturedEstablishmentsProps {
  establishments: Establishment[];
}

export default function FeaturedEstablishments({ establishments }: FeaturedEstablishmentsProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark mb-8">Coups de cœur</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.slice(0, 3).map((establishment, index) => (
            <EstablishmentCard 
              key={establishment.id} 
              establishment={establishment}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}