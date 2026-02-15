// Types pour les établissements
export type EstablishmentCategory = 'restaurant' | 'bar' | 'hotel' | 'lounge';

export interface Establishment {
  id: string;
  name: string;
  category: EstablishmentCategory;
  address: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  images?: string[]; // Galerie d'images
  phone?: string;
  hours?: string;
  isOpen?: boolean;
  isPremium?: boolean;
  description?: string;
  latitude?: number;
  longitude?: number;
  schedule?: DaySchedule[];
  amenities?: string[];
  priceRange?: string;
}

export interface DaySchedule {
  day: string;
  hours: string;
  isToday?: boolean;
  isClosed?: boolean;
}

// Types pour les événements
export interface Event {
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
}