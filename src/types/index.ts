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
  phone?: string;
  hours?: string;
  isOpen?: boolean;
  isPremium?: boolean;
  description?: string;
  latitude?: number;
  longitude?: number;
}

// Types pour les événements
export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  establishment: string;
  price: string;
  availablePlaces: number;
  totalPlaces: number;
  imageUrl: string;
}