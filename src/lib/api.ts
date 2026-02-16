import { 
  Establishment, 
  EstablishmentListItem, 
  Event, 
  PaginatedResponse,
  ApiCategory,
  ApiQuartier 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Durées de revalidation (en secondes)
const CACHE_TIMES = {
  CATEGORIES: 3600,      // 1 heure
  QUARTIERS: 3600,       // 1 heure
  ESTABLISHMENTS: 300,   // 5 minutes
  FEATURED: 600,         // 10 minutes
  EVENTS: 180,           // 3 minutes
  DETAIL: 300,           // 5 minutes
};

// Helper pour gérer les erreurs
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } else {
        const errorText = await response.text();
        errorMessage += ` - ${errorText}`;
      }
    } catch (e) {
      errorMessage += ' - Could not parse error response';
    }
    
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Response is not JSON:', text);
    throw new Error('Response is not JSON');
  }

  return response.json();
}

// Service pour les catégories
export const categoryService = {
  async getAll(): Promise<ApiCategory[]> {
    console.log('Fetching categories from:', `${API_BASE_URL}/api/v1/categories/`);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/`, {
      next: { 
        revalidate: CACHE_TIMES.CATEGORIES,
        tags: ['categories'] 
      },
    });
    
    return handleResponse<ApiCategory[]>(response);
  },
};

// Service pour les quartiers
export const quartierService = {
  async getAll(): Promise<ApiQuartier[]> {
    console.log('Fetching quartiers from:', `${API_BASE_URL}/api/v1/quartiers/`);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/quartiers/`, {
      next: { 
        revalidate: CACHE_TIMES.QUARTIERS,
        tags: ['quartiers'] 
      },
    });
    
    return handleResponse<ApiQuartier[]>(response);
  },
};

// Service pour les établissements
export const establishmentService = {
  // Liste paginée
  async getAll(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
    search?: string;
  }): Promise<PaginatedResponse<EstablishmentListItem>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/api/v1/etablissements/?${queryParams}`;
    console.log('Fetching establishments from:', url);

    const response = await fetch(url, { 
      next: { 
        revalidate: CACHE_TIMES.ESTABLISHMENTS,
        tags: ['establishments', `establishments-page-${params?.page || 1}`] 
      },
    });
    
    return handleResponse<PaginatedResponse<EstablishmentListItem>>(response);
  },

  // Établissements featured (retourne un tableau direct)
  async getFeatured(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<EstablishmentListItem>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

    const url = `${API_BASE_URL}/api/v1/etablissements/featured/?${queryParams}`;
    console.log('Fetching featured establishments from:', url);

    const response = await fetch(url, { 
      next: { 
        revalidate: CACHE_TIMES.FEATURED,
        tags: ['establishments', 'featured'] 
      },
    });
    
    const data = await handleResponse<any>(response);
    
    // Si l'API retourne un tableau direct (pas paginé)
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data as EstablishmentListItem[],
      };
    }
    
    // Sinon, c'est déjà un objet paginé
    return data as PaginatedResponse<EstablishmentListItem>;
  },

  // Recherche
  async search(query: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<EstablishmentListItem>> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

    const url = `${API_BASE_URL}/api/v1/etablissements/search/?${queryParams}`;
    console.log('Searching establishments:', url);

    // Pour la recherche, on utilise un cache plus court car c'est dynamique
    const response = await fetch(url, { 
      next: { 
        revalidate: 60, // 1 minute pour les recherches
        tags: ['establishments', 'search'] 
      },
    });
    
    return handleResponse<PaginatedResponse<EstablishmentListItem>>(response);
  },

  // Détail d'un établissement
  async getById(id: string): Promise<Establishment> {
    const url = `${API_BASE_URL}/api/v1/etablissements/${id}/`;
    console.log('Fetching establishment detail:', url);

    const response = await fetch(url, { 
      next: { 
        revalidate: CACHE_TIMES.DETAIL,
        tags: ['establishments', `establishment-${id}`] 
      },
    });
    
    return handleResponse<Establishment>(response);
  },
};

// Service pour les événements
export const eventService = {
  // Liste des événements
  async getAll(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
    etablissement_id?: string;
  }): Promise<PaginatedResponse<Event>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.etablissement_id) queryParams.append('etablissement_id', params.etablissement_id);

    const url = `${API_BASE_URL}/api/v1/events/?${queryParams}`;
    console.log('Fetching events from:', url);

    const response = await fetch(url, { 
      next: { 
        revalidate: CACHE_TIMES.EVENTS,
        tags: ['events', `events-page-${params?.page || 1}`] 
      },
    });
    
    return handleResponse<PaginatedResponse<Event>>(response);
  },

  // Détail d'un événement
  async getById(id: string): Promise<Event> {
    const url = `${API_BASE_URL}/api/v1/events/${id}/`;
    console.log('Fetching event detail:', url);

    const response = await fetch(url, { 
      next: { 
        revalidate: CACHE_TIMES.DETAIL,
        tags: ['events', `event-${id}`] 
      },
    });
    
    return handleResponse<Event>(response);
  },
};