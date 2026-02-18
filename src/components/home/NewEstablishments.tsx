import EstablishmentCard from '@/components/ui/EstablishmentCard';
import { Establishment } from '@/types';

interface NewEstablishmentsProps {
  establishments: Establishment[];
}

export default function NewEstablishments({ establishments }: NewEstablishmentsProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark mb-8">Nouveaux établissements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {establishments.slice(3, 8).map((establishment, index) => (
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