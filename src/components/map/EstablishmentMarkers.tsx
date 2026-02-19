'use client';

import { useEffect, useRef } from 'react';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';

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
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    // Nettoyer les anciens markers et clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Créer les markers
    const markers: google.maps.Marker[] = [];

    establishments.forEach((establishment) => {
      const lat = toNumber(establishment.latitude);
      const lng = toNumber(establishment.longitude);

      if (lat === null || lng === null) {
        return;
      }

      const color = CATEGORY_COLORS[establishment.categorie_nom] || CATEGORY_COLORS.default;

      // Créer le marker SANS l'ajouter à la carte (on le fera via le clusterer)
      const marker = new google.maps.Marker({
        position: { lat, lng },
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

      // IMPORTANT : Ajouter l'événement click AVANT de passer au clusterer
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

    // Créer le clusterer avec configuration optimale
    if (markers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map,
        markers,
        // Algorithme avec seuil de distance plus élevé
        algorithm: new SuperClusterAlgorithm({
          radius: 100, // Distance en pixels pour regrouper les markers
        }),
        // Renderer personnalisé pour les clusters
        renderer: {
          render: ({ count, position }, stats) => {
            // Déterminer la couleur et taille selon le nombre
            let color = '#06B6D4';
            let size = 40;
            
            if (count > 50) {
              color = '#E63946';
              size = 60;
            } else if (count > 20) {
              color = '#F77F00';
              size = 50;
            } else if (count > 10) {
              color = '#8B5CF6';
              size = 45;
            }

            // Créer le marker de cluster
            const clusterMarker = new google.maps.Marker({
              position,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="white" stroke-width="3" opacity="0.95"/>
                    <text x="${size/2}" y="${size/2}" text-anchor="middle" dy="0.35em" font-family="Arial" font-size="${size > 50 ? '16' : '14'}" font-weight="bold" fill="white">
                      ${count > 99 ? '99+' : count}
                    </text>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(size, size),
                anchor: new google.maps.Point(size / 2, size / 2),
              },
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });

            return clusterMarker;
          },
        },
        // Callback quand on clique sur un cluster
        onClusterClick: (event, cluster, map) => {
          // Zoomer sur le cluster
          map.fitBounds(cluster.bounds as google.maps.LatLngBounds);
          
          // Zoomer un peu plus
          const currentZoom = map.getZoom() || 12;
          map.setZoom(Math.min(currentZoom + 2, 18));
        },
      });

      // Ajuster la vue pour afficher tous les markers
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

    // Cleanup
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, establishments, onMarkerClick]);

  return null;
}