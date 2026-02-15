'use client';

import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ContactInfoProps {
  address: string;
  phone?: string;
  hours?: string;
  isOpen?: boolean;
  latitude?: number;
  longitude?: number;
}

export default function ContactInfo({ 
  address, 
  phone, 
  hours, 
  isOpen,
  latitude,
  longitude 
}: ContactInfoProps) {
  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleDirections = () => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
      {/* Adresse */}
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="text-dark font-medium">{address}</p>
        </div>
      </div>

      {/* Téléphone */}
      {phone && (
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-dark font-medium">{phone}</p>
          </div>
        </div>
      )}

      {/* Horaires */}
      {hours && (
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-dark font-medium">{hours}</p>
            {isOpen !== undefined && (
              <span className={`text-sm font-semibold ${isOpen ? 'text-accent' : 'text-red-500'}`}>
                {isOpen ? 'OUVERT' : 'FERMÉ'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        {latitude && longitude && (
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center gap-2"
            onClick={handleDirections}
          >
            <Navigation className="w-4 h-4" />
            Itinéraire
          </Button>
        )}
        {phone && (
          <Button 
            variant="primary" 
            className="flex-1 flex items-center justify-center gap-2"
            onClick={handleCall}
          >
            <Phone className="w-4 h-4" />
            Appeler
          </Button>
        )}
      </div>
    </div>
  );
}