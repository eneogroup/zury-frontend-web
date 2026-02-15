import { Establishment, Event } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Service pour les établissements
export const establishmentService = {
  // Récupérer tous les établissements
  async getAll(): Promise<Establishment[]> {
    const response = await fetch(`${API_BASE_URL}/establishments/`);
    if (!response.ok) throw new Error('Failed to fetch establishments');
    return response.json();
  },

  // Récupérer un établissement par ID
  async getById(id: string): Promise<Establishment> {
    const response = await fetch(`${API_BASE_URL}/establishments/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch establishment');
    return response.json();
  },

  // Rechercher des établissements
  async search(query: string, filters?: {
    category?: string;
    neighborhood?: string;
    minRating?: number;
  }): Promise<Establishment[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.neighborhood) params.append('neighborhood', filters.neighborhood);
    if (filters?.minRating) params.append('min_rating', filters.minRating.toString());

    const response = await fetch(`${API_BASE_URL}/establishments/search/?${params}`);
    if (!response.ok) throw new Error('Failed to search establishments');
    return response.json();
  },
};

// Service pour les événements
export const eventService = {
  // Récupérer tous les événements
  async getAll(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Récupérer un événement par ID
  async getById(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  },

  // Filtrer les événements par période
  async getByPeriod(period: 'today' | 'weekend' | 'week' | 'month'): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },
};