'use client';

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState, useMemo } from 'react';
import { MapPin, Star, Navigation2 } from 'lucide-react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

interface Establishment {
  id: string;
  name: string;
  category: 'restaurant' | 'bar' | 'hotel' | 'lounge';
  address: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  latitude?: number;
  longitude?: number;
  imageUrl: string;
}

interface MapViewProps {
  establishments: Establishment[];
}

export default function MapView({ establishments }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Centre de la carte (Brazzaville)
  const center = useMemo(() => ({ lat: -4.2634, lng: 15.2429 }), []);

  // Filtrer les établissements avec coordonnées
  const establishmentsWithCoords = establishments.filter(
    (est) => est.latitude !== undefined && est.longitude !== undefined
  );

  // Couleurs des pins selon la catégorie
  const getPinColor = (category: string) => {
    switch (category) {
      case 'restaurant': return '#1E6FA8'; // primary
      case 'bar': return '#F4C430'; // gold
      case 'hotel': return '#28B463'; // accent
      case 'lounge': return '#12243A'; // dark
      default: return '#1E6FA8';
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Position:', position.coords.latitude, position.coords.longitude);
          // Tu peux centrer la carte ici si besoin
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  if (!apiKey) {
    return (
      <div className="h-screen bg-light flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark mb-2">
            Clé API Google Maps manquante
          </h2>
          <p className="text-gray">
            Ajoutez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY dans votre fichier .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="zury-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Markers */}
          {establishmentsWithCoords.map((establishment) => (
            <AdvancedMarker
              key={establishment.id}
              position={{
                lat: establishment.latitude!,
                lng: establishment.longitude!,
              }}
              onClick={() => setSelectedEstablishment(establishment)}
              onMouseEnter={() => setHoveredId(establishment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Pin
                background={getPinColor(establishment.category)}
                borderColor={hoveredId === establishment.id ? '#fff' : undefined}
                glyphColor="#fff"
                scale={hoveredId === establishment.id ? 1.2 : 1}
              />
            </AdvancedMarker>
          ))}

          {/* InfoWindow */}
          {selectedEstablishment && (
            <InfoWindow
              position={{
                lat: selectedEstablishment.latitude!,
                lng: selectedEstablishment.longitude!,
              }}
              onCloseClick={() => setSelectedEstablishment(null)}
            >
              <div className="p-2 min-w-[250px]">
                <div className="mb-2">
                  <Badge variant={selectedEstablishment.category}>
                    {selectedEstablishment.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-dark text-lg mb-1">
                  {selectedEstablishment.name}
                </h3>
                <p className="text-sm text-gray mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedEstablishment.neighborhood}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="ml-1 text-sm font-medium">
                      {selectedEstablishment.rating}/5
                    </span>
                  </div>
                  <span className="text-xs text-gray">
                    ({selectedEstablishment.reviewCount} avis)
                  </span>
                </div>
                <Link
                  href={`/establishments/${selectedEstablishment.id}`}
                  className="block w-full text-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Voir les détails
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Légende */}
      <div className="absolute top-4 left-4 bg-white rounded-xl p-4 shadow-lg max-w-xs z-10">
        <h3 className="font-bold text-dark mb-3">Légende</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span className="text-sm text-gray">Restaurant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gold"></div>
            <span className="text-sm text-gray">Bar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent"></div>
            <span className="text-sm text-gray">Hôtel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-dark"></div>
            <span className="text-sm text-gray">Lounge</span>
          </div>
        </div>

        <button
          onClick={handleMyLocation}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Navigation2 className="w-4 h-4" />
          Me localiser
        </button>
      </div>

      {/* Liste des établissements (sidebar) */}
      <div className="absolute top-4 right-4 bottom-4 w-80 bg-white rounded-xl shadow-lg overflow-hidden z-10 hidden lg:flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-dark">
            Établissements ({establishmentsWithCoords.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {establishmentsWithCoords.map((establishment) => (
            <button
              key={establishment.id}
              onClick={() => setSelectedEstablishment(establishment)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedEstablishment?.id === establishment.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 hover:border-primary/30 hover:bg-light'
              }`}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: getPinColor(establishment.category) }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-dark text-sm mb-1 truncate">
                    {establishment.name}
                  </h4>
                  <p className="text-xs text-gray truncate">
                    {establishment.neighborhood}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="text-xs font-medium">
                      {establishment.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}