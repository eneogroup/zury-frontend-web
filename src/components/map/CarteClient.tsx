// 'use client';

// import { useState, useMemo } from 'react';
// import { Filter } from 'lucide-react';
// import EstablishmentsMap from '@/components/map/EstablishmentsMap';
// import MapFilters, { FilterState } from '@/components/map/MapFilters';
// import { Establishment, ApiCategory, ApiQuartier } from '@/types';

// interface CarteClientProps {
//   establishments: Establishment[];
//   categories: ApiCategory[];
//   quartiers: ApiQuartier[];
// }

// export default function CarteClient({
//   establishments,
//   categories,
//   quartiers,
// }: CarteClientProps) {
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState<FilterState>({
//     categories: [],
//     quartiers: [],
//     minRating: 0,
//   });

//   // Filtrer les établissements selon les critères
//   const filteredEstablishments = useMemo(() => {
//     return establishments.filter((establishment) => {
//       // Filtre catégorie
//       if (filters.categories.length > 0) {
//         if (!filters.categories.includes(establishment.categorie_id)) {
//           return false;
//         }
//       }

//       // Filtre quartier
//       if (filters.quartiers.length > 0) {
//         if (!filters.quartiers.includes(establishment.quartier_id)) {
//           return false;
//         }
//       }

//       // Filtre note minimale
//       if (filters.minRating > 0) {
//         const rating = parseFloat(establishment.note_moyenne);
//         if (isNaN(rating) || rating < filters.minRating) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [establishments, filters]);

//   const handleFilterChange = (newFilters: FilterState) => {
//     setFilters(newFilters);
//   };

//   return (
//     <div className="relative w-full h-full">
//       {/* Bouton pour ouvrir les filtres */}
//       <div className="absolute top-4 left-4 z-20">
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition"
//         >
//           <Filter className="w-5 h-5" />
//           <span className="font-semibold text-sm">Filtres</span>
//           {Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : v > 0)) && (
//             <div className="w-2 h-2 bg-primary rounded-full"></div>
//           )}
//         </button>
//       </div>

//       {/* Composant des filtres */}
//       <MapFilters
//         categories={categories}
//         quartiers={quartiers}
//         onFilterChange={handleFilterChange}
//         isOpen={showFilters}
//         onClose={() => setShowFilters(false)}
//       />

//       {/* Carte avec les établissements filtrés */}
//       <EstablishmentsMap
//         establishments={filteredEstablishments}
//         className="w-full h-full"
//       />

//       {/* Indicateur du nombre d'établissements filtrés */}
//       {filteredEstablishments.length !== establishments.length && (
//         <div className="absolute bottom-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-700">
//             <span className="font-semibold">{filteredEstablishments.length}</span> /
//             <span className="font-semibold ml-1">{establishments.length}</span> établissements
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
