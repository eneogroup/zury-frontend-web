// Types basés sur l'API Django
export type EstablishmentCategory = 'restaurant' | 'bar' | 'hotel' | 'lounge';

export interface ApiCategory {
  value: string;
  label: string;
  count: number;
}

export interface ApiQuartier {
  value: string;
  label: string;
  count: number;
}

export interface Establishment {
  id: string;
  nom: string;
  description?: string;
  categorie_id: string;
  categorie_nom: string;
  quartier_id: string;
  quartier_nom: string;
  ville_nom: string;
  pays_nom?: string;
  adresse: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  facebook?: string;
  instagram?: string;
  latitude: string | number | null;
  longitude: string | number | null;
  horaires?: any;
  tags?: string[];
  medias?: any;
  note_moyenne: string;
  nombre_avis: number;
  nombre_vues?: number;
  est_featured: boolean;
  image_principale?: string;
  nombre_events_actifs?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EstablishmentListItem {
  id: string;
  nom: string;
  categorie_id: string;
  categorie_nom: string;
  quartier_id: string;
  quartier_nom: string;
  ville_nom: string;
  adresse: string;
  latitude: string | number | null;
  longitude: string | number | null;
  note_moyenne: string;
  nombre_avis: number;
  image_principale: string;
  est_featured: boolean;
}

export interface Event {
  id: string;
  etablissement?: EstablishmentListItem;
  titre: string;
  description?: string;
  date_debut: string;
  date_fin: string;
  prix: string;
  est_gratuit?: boolean;
  nb_places_total: number;
  nb_places_reservees?: number;
  places_disponibles?: number;
  est_complet?: boolean;
  affiche_url?: string;
  type_event: string;
  type_event_display?: string;
  est_featured: boolean;
  statut?: string;
  statut_display?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransformedEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  establishment: string;
  establishmentId?: string;
  price: string;
  availablePlaces: number;
  totalPlaces: number;
  imageUrl: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  isComplete: boolean;
}

export interface TransformedEstablishment {
  id: string;
  name: string;
  category: EstablishmentCategory;
  address: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  latitude?: number;
  longitude?: number;
  isPremium: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DaySchedule {
  day: string;
  hours: string;
  isToday?: boolean;
  isClosed?: boolean;
}