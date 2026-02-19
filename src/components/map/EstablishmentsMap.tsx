'use client';

import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Establishment } from '@/types';
import { X } from 'lucide-react';

interface EstablishmentsMapProps {
  establishments: Establishment[];
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Centre sur Brazzaville par défaut
const DEFAULT_CENTER = { lat: -4.2634, lng: 15.2429 };
const DEFAULT_ZOOM = 12;

export default function EstablishmentsMap({
  establishments,
  className = 'w-full h-full',
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}: EstablishmentsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [clusterer, setClusterer] = useState<MarkerClusterer | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [infoWindows, setInfoWindows] = useState<Map<string, google.maps.InfoWindow>>(new Map());
  const { isLoaded, loadError } = useGoogleMaps();

  // Initialiser la carte
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const newMap = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      mapTypeControl: true,
      streetViewControl: true,
      zoomControl: true,
      fullscreenControl: true,
    });

    setMap(newMap);
  }, [isLoaded, center, zoom, map]);

  // Ajouter les markers avec cluster
  useEffect(() => {
    if (!map || !establishments.length) return;

    // Nettoyer les anciens markers et infowindows
    markers.forEach((marker) => marker.setMap(null));
    infoWindows.forEach((iw) => iw.close());

    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows = new Map<string, google.maps.InfoWindow>();

    establishments.forEach((establishment) => {
      if (!establishment.latitude || !establishment.longitude) return;

      const lat = typeof establishment.latitude === 'string' 
        ? parseFloat(establishment.latitude) 
        : establishment.latitude;
      const lng = typeof establishment.longitude === 'string' 
        ? parseFloat(establishment.longitude) 
        : establishment.longitude;

      // Déterminer la couleur du marker selon la catégorie
      const categoryColor: { [key: string]: string } = {
        restaurant: 'FF6B6B',
        bar: '4ECDC4',
        hotel: 'FFE66D',
        lounge: '95E1D3',
      };

      const color = categoryColor[establishment.categorie_id] || 'FF6B6B';

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: establishment.nom,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: `#${color}`,
          fillOpacity: 0.8,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      // Créer l'InfoWindow
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-lg mb-1">${establishment.nom}</h3>
            <p class="text-sm text-gray-600 mb-2">${establishment.categorie_nom}</p>
            <p class="text-xs text-gray-600 mb-2">${establishment.quartier_nom}</p>
            ${establishment.adresse ? `<p class="text-xs text-gray-600 mb-2">${establishment.adresse}</p>` : ''}
            ${establishment.note_moyenne ? `
              <div class="flex items-center gap-1 mb-2">
                <span class="text-yellow-500">⭐</span>
                <span class="text-sm font-semibold">${establishment.note_moyenne}</span>
                <span class="text-xs text-gray-600">(${establishment.nombre_avis} avis)</span>
              </div>
            ` : ''}
            ${establishment.telephone ? `<p class="text-xs text-blue-600"><a href="tel:${establishment.telephone}">${establishment.telephone}</a></p>` : ''}
            <div class="mt-3 flex gap-2">
              <a href="/establishments/${establishment.id}" class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                Voir détails
              </a>
            </div>
          </div>
        `,
      });

      newInfoWindows.set(establishment.id, infoWindow);

      // Ajouter le listener pour ouvrir l'InfoWindow
      marker.addListener('click', () => {
        // Fermer tous les autres infowindows
        infoWindows.forEach((iw) => iw.close());
        infoWindow.open(map, marker);
        setSelectedMarker(establishment.id);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);

    // Ajouter le MarkerClusterer
    if (newMarkers.length > 0) {
      if (clusterer) {
        clusterer.clearMarkers();
        clusterer.addMarkers(newMarkers);
      } else {
        const newClusterer = new MarkerClusterer({ map, markers: newMarkers });
        setClusterer(newClusterer);
      }
    }
  }, [map, establishments, infoWindows, markers, clusterer]);

  if (loadError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center p-8">
          <p className="text-red-600 font-semibold mb-2">Erreur de chargement de la carte</p>
          <p className="text-gray-600 text-sm">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className={className} />
      
      {/* Indicateur du nombre d'établissements */}
      <div className="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{establishments.length}</span> établissements
        </p>
      </div>

      {/* Légende des catégories */}
      <div className="absolute bottom-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-semibold text-sm mb-3">Catégories</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
            <span className="text-xs">Restaurant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4ECDC4' }}></div>
            <span className="text-xs">Bar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFE66D' }}></div>
            <span className="text-xs">Hotel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#95E1D3' }}></div>
            <span className="text-xs">Lounge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
