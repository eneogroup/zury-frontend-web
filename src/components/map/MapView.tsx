'use client';

import { useState, useEffect } from 'react';
import GoogleMap from './GoogleMap';
import LocationButton from './LocationButton';
import EstablishmentMarkers from './EstablishmentMarkers';
import EstablishmentInfoWindow from './EstablishmentInfoWindow';
import MapLegend from './MapLegend';
import { cachedEstablishmentService } from '@/lib/cached-api';
import { Loader } from 'lucide-react';
import ZoomControls from './ZoomControls';

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

export default function MapView() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEstablishment, setSelectedEstablishment] = useState<any>(null);

  // Charger les établissements
  useEffect(() => {
    async function loadEstablishments() {
      try {
        setIsLoading(true);
        const response = await cachedEstablishmentService.getAll({ 
          page_size: 100
        });
        
        const data = (response as any).results || (response as any) || [];
        
        // Filtrer uniquement ceux qui ont des coordonnées VALIDES
        const withCoordinates = data.filter((est: any) => {
          const lat = parseFloat(est.latitude);
          const lng = parseFloat(est.longitude);
          return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        });
        
        setEstablishments(withCoordinates);
        console.log(`✅ ${withCoordinates.length} établissements chargés avec coordonnées valides`);
      } catch (error) {
        console.error('Erreur lors du chargement des établissements:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEstablishments();
  }, []);

  const handleMapLoad = (loadedMap: google.maps.Map) => {
    setMap(loadedMap);
    console.log('✅ Map loaded successfully');
  };


  const handleMarkerClick = (establishment: any) => {
    console.log('🎯 handleMarkerClick called with:', establishment);
    setSelectedEstablishment(establishment);
  };

  const handleCloseInfoWindow = () => {
    console.log('❌ Closing InfoWindow');
    setSelectedEstablishment(null);
  };

  // Calculer les catégories pour la légende
  const categoryStats = establishments.reduce((acc: any, est: any) => {
    const category = est.categorie_nom || 'Autre';
    if (!acc[category]) {
      acc[category] = { count: 0, color: CATEGORY_COLORS[category] || CATEGORY_COLORS.default };
    }
    acc[category].count++;
    return acc;
  }, {});

  const legendCategories = Object.entries(categoryStats).map(([name, data]: [string, any]) => ({
    name,
    color: data.color,
    count: data.count,
  }));

  return (
    <div className="relative w-full h-full">
      <GoogleMap onMapLoad={handleMapLoad} onMapClick={handleCloseInfoWindow} className="w-full h-full" />
      
      {/* Markers */}
      {map && !isLoading && establishments.length > 0 && (
        <EstablishmentMarkers
          map={map}
          establishments={establishments}
          onMarkerClick={handleMarkerClick}
        />
      )}

      {/* InfoWindow */}
      {map && selectedEstablishment && (
        <EstablishmentInfoWindow
          map={map}
          establishment={selectedEstablishment}
          onClose={handleCloseInfoWindow}
        />
      )}
      
      {/* Bouton de localisation */}
      {map && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 space-y-2">
          <LocationButton map={map} />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
          <Loader className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-gray-600">
            Chargement des établissements...
          </span>
        </div>
      )}

      {/* Légende */}
      {!isLoading && establishments.length > 0 && (
        <MapLegend categories={legendCategories} />
      )}

      {/* Compteur d'établissements */}
      {!isLoading && establishments.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg px-4 py-2">
          <p className="text-sm font-semibold text-dark">
            {establishments.length} établissement{establishments.length > 1 ? 's' : ''} sur la carte
          </p>
        </div>
      )}
    </div>
  );
}