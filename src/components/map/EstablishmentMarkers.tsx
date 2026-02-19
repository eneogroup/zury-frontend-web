'use client';

import { useEffect, useRef } from 'react';

interface Establishment {
  id: string;
  nom: string;
  latitude: number | string;
  longitude: number | string;
  categorie_nom: string;
  imageUrl?: string;
}

interface EstablishmentMarkersProps {
  map: google.maps.Map;
  establishments: Establishment[];
  onMarkerClick?: (establishment: Establishment) => void;
}

// Couleurs par catégorie
const CATEGORY_COLORS: Record<string, string> = {
  Restaurant: '#E63946',
  Bar: '#F77F00',
  Hôtel: '#06B6D4',
  Hotel: '#06B6D4',
  Lounge: '#8B5CF6',
  Maquis: '#F59E0B',
  default: '#6B7280',
};

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? null : num;
}

export default function EstablishmentMarkers({
  map,
  establishments,
  onMarkerClick,
}: EstablishmentMarkersProps) {
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Nettoyer les anciens markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Créer les nouveaux markers SANS clusterer
    const markers: google.maps.Marker[] = [];

    establishments.forEach((establishment) => {
      const lat = toNumber(establishment.latitude);
      const lng = toNumber(establishment.longitude);

      if (lat === null || lng === null) {
        return;
      }
      console.log('Établissement:', establishment.nom);
     console.log('Catégorie reçue:', establishment.categorie_nom);
      console.log('Type de categorie:', typeof establishment.categorie_nom);
      const color = CATEGORY_COLORS[establishment.categorie_nom] || CATEGORY_COLORS.default;

      // Créer le marker
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map, // ← Ajouter directement à la carte
        title: establishment.nom,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      // Événement click
      marker.addListener('click', () => {
        console.log('🖱️ Marker clicked:', establishment.nom);
        
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1400);

        if (onMarkerClick) {
          onMarkerClick(establishment);
        }
      });

      markers.push(marker);
    });

    markersRef.current = markers;

    // Ajuster la vue
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }
    }

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, establishments, onMarkerClick]);

  return null;
}