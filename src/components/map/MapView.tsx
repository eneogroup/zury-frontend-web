'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import GoogleMap from './GoogleMap';
import LocationButton from './LocationButton';
import EstablishmentMarkers from './EstablishmentMarkers';
import EstablishmentInfoWindow from './EstablishmentInfoWindow';
import MapLegend from './MapLegend';
import MapFilters from './MapFilters';
import { cachedEstablishmentService } from '@/lib/cached-api';
import { Loader } from 'lucide-react';

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
  const [filters, setFilters] = useState({
    categories: [] as string[],
    neighborhoods: [] as string[],
    search: '',
  });

  // Charger les établissements
  useEffect(() => {
    async function loadEstablishments() {
      try {
        setIsLoading(true);
        const response = await cachedEstablishmentService.getAll({ 
          page_size: 100
        });
        
        const data = (response as any).results || (response as any) || [];
        
        const withCoordinates = data.filter((est: any) => {
          const lat = parseFloat(est.latitude);
          const lng = parseFloat(est.longitude);
          return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        });
        
        setEstablishments(withCoordinates);
        console.log(`✅ ${withCoordinates.length} établissements chargés`);
      } catch (error) {
        console.error('Erreur lors du chargement des établissements:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEstablishments();
  }, []);

  // Filtrer les établissements
  const filteredEstablishments = useMemo(() => {
    return establishments.filter((est) => {
      // Filtre par catégorie
      if (filters.categories.length > 0) {
        const categoryMatch = filters.categories.some(cat => 
          est.categorie?.toLowerCase().includes(cat.toLowerCase()) ||
          est.categorie_nom?.toLowerCase().includes(cat.toLowerCase())
        );
        if (!categoryMatch) return false;
      }

      // Filtre par quartier
      if (filters.neighborhoods.length > 0) {
        const neighborhoodMatch = filters.neighborhoods.some(neigh =>
          est.quartier?.toLowerCase() === neigh.toLowerCase() ||
          est.quartier_nom?.toLowerCase() === neigh.toLowerCase()
        );
        if (!neighborhoodMatch) return false;
      }

      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = est.nom?.toLowerCase().includes(searchLower);
        if (!nameMatch) return false;
      }

      return true;
    });
  }, [establishments, filters]);

  // Extraire les catégories uniques avec comptage
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    establishments.forEach(est => {
      const category = est.categorie || est.categorie_nom || 'Autre';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name,
      name,
      count,
    }));
  }, [establishments]);

  // Extraire les quartiers uniques
  const neighborhoods = useMemo(() => {
    const neighborhoodSet = new Set<string>();
    
    establishments.forEach(est => {
      const neighborhood = est.quartier || est.quartier_nom;
      if (neighborhood) {
        neighborhoodSet.add(neighborhood);
      }
    });

    return Array.from(neighborhoodSet).sort();
  }, [establishments]);

  const handleMapLoad = (loadedMap: google.maps.Map) => {
    setMap(loadedMap);
    console.log('✅ Map loaded successfully');
  };

  const handleMarkerClick = (establishment: any) => {
    setSelectedEstablishment(establishment);
    console.log('🎯 Marker clicked:', establishment.nom);
  };

  const handleCloseInfoWindow = () => {
    setSelectedEstablishment(null);
  };

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    console.log('🎛️ Filters updated:', newFilters);
  }, []);

  // Calculer les catégories pour la légende
  const categoryStats = filteredEstablishments.reduce((acc: any, est: any) => {
    const category = est.categorie || est.categorie_nom || 'Autre';
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
      <GoogleMap 
        onMapLoad={handleMapLoad} 
        onMapClick={handleCloseInfoWindow}
        className="w-full h-full" 
      />
      
      {/* Markers */}
      {map && !isLoading && filteredEstablishments.length > 0 && (
        <EstablishmentMarkers
          map={map}
          establishments={filteredEstablishments}
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
      
      {/* Filtres - Positionnés en haut à gauche sur desktop, en bas sur mobile */}
      {!isLoading && (
        <div className="absolute top-4 left-4 md:top-4 md:left-4 bottom-auto md:bottom-auto z-10">
          <MapFilters
            categories={categories}
            neighborhoods={neighborhoods}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Bouton de localisation - En haut à gauche sous les filtres sur desktop, en bas à droite sur mobile */}
      {map && (
        <div className="absolute bottom-24 right-4 md:top-20 md:left-4 md:right-auto md:bottom-auto z-10">
          <LocationButton map={map} />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
          <Loader className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-gray-600">
            Chargement...
          </span>
        </div>
      )}

      {/* Légende - Cachée sur mobile, visible sur desktop */}
      {!isLoading && filteredEstablishments.length > 0 && (
        <div className="hidden md:block absolute bottom-4 right-4 z-10">
          <MapLegend categories={legendCategories} />
        </div>
      )}

      {/* Compteur d'établissements - En bas sur mobile et desktop */}
      {!isLoading && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg px-3 py-2 md:px-4 md:py-2">
          <p className="text-xs md:text-sm font-semibold text-dark">
            <span className="hidden sm:inline">
              {filteredEstablishments.length} / {establishments.length} établissement{filteredEstablishments.length > 1 ? 's' : ''}
            </span>
            <span className="sm:hidden">
              {filteredEstablishments.length} / {establishments.length}
            </span>
          </p>
        </div>
      )}


      {/* Message si aucun résultat */}
      {!isLoading && filteredEstablishments.length === 0 && establishments.length > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-lg shadow-lg p-6 text-center max-w-sm">
          <p className="text-lg font-semibold text-dark mb-2">
            Aucun établissement trouvé
          </p>
          <p className="text-sm text-gray-600">
            Essayez de modifier vos filtres
          </p>
        </div>
      )}
    </div>
  );
}