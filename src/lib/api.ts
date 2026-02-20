// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zury-backend-production.up.railway.app';

// Durées de revalidation (en secondes)
const CACHE_TIMES = {
  CATEGORIES: 3600,      // 1 heure
  QUARTIERS: 3600,       // 1 heure
  ESTABLISHMENTS: 300,   // 5 minutes
  FEATURED: 600,         // 10 minutes
  EVENTS: 180,           // 3 minutes
  DETAIL: 300,           // 5 minutes
  STATS: 300,            // 5 minutes
};

// Helper pour gérer les erreurs et extraire les données du wrapper
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error ${response.status}:`, errorText);
    throw new Error(`API Error: ${response.status}`);
  }
  
  const json = await response.json();
  
  // L'API wrappe les réponses dans { success, data, error }
  // On extrait juste la partie "data"
  if (json.success && json.data !== undefined) {
    return json.data as T;
  }
  
  // Si pas de wrapper, retourner tel quel
  return json as T;
}

// Service pour les statistiques
export const statsService = {
  async getGlobalStats() {
    const response = await fetch(`${API_BASE_URL}/api/v1/stats/`, {
      next: { 
        revalidate: CACHE_TIMES.STATS,
        tags: ['stats'] 
      },
    });
    
    return handleResponse(response);
  },
};

// Service pour les catégories
export const categoryService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/`, {
      next: { 
        revalidate: CACHE_TIMES.CATEGORIES,
        tags: ['categories'] 
      },
    });
    return handleResponse(response);
  },
};

// Service pour les quartiers
export const quartierService = {
  async getAll(ville_id?: string) {
    const url = ville_id 
      ? `${API_BASE_URL}/api/v1/quartiers/?ville=${ville_id}`
      : `${API_BASE_URL}/api/v1/quartiers/`;
      
    const response = await fetch(url, {
      next: { 
        revalidate: CACHE_TIMES.QUARTIERS,
        tags: ['quartiers'] 
      },
    });
    return handleResponse(response);
  },
};

// Service pour les établissements
export const establishmentService = {
  // Liste paginée
  async getAll(params?: {
    page?: number;
    page_size?: number;
    categorie?: string;
    quartier?: string;
    ville?: string;
    note_min?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.categorie) queryParams.append('categorie', params.categorie);
    if (params?.quartier) queryParams.append('quartier', params.quartier);
    if (params?.ville) queryParams.append('ville', params.ville);
    if (params?.note_min) queryParams.append('note_min', params.note_min.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/api/v1/etablissements/?${queryParams}`;
    
    const response = await fetch(url, { 
      next: { 
        revalidate: CACHE_TIMES.ESTABLISHMENTS,
        tags: ['establishments', `establishments-page-${params?.page || 1}`] 
      },
    });
    
    return handleResponse(response);
  },

  // Établissements featured
  async getFeatured() {
    const response = await fetch(`${API_BASE_URL}/api/v1/etablissements/featured/`, { 
      next: { 
        revalidate: CACHE_TIMES.FEATURED,
        tags: ['establishments', 'featured'] 
      },
    });
    
    const data = await handleResponse<any>(response);
    
    // Si c'est un tableau direct, le wrapper en pagination
    if (Array.isArray(data)) {
      return {
        count: data.length,
        total_pages: 1,
        current_page: 1,
        page_size: data.length,
        next: null,
        previous: null,
        results: data
      };
    }
    
    // Sinon retourner tel quel (déjà paginé)
    return data;
  },

  // Recherche
  async search(query: string, params?: {
    page?: number;
    page_size?: number;
  }) {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

    const url = `${API_BASE_URL}/api/v1/etablissements/search/?${queryParams}`;
    
    const response = await fetch(url, { 
      next: { 
        revalidate: 60,
        tags: ['establishments', 'search'] 
      },
    });
    
    return handleResponse(response);
  },

  // Détail d'un établissement
  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/etablissements/${id}/`, { 
      next: { 
        revalidate: CACHE_TIMES.DETAIL,
        tags: ['establishments', `establishment-${id}`] 
      },
    });
    
    return handleResponse(response);
  },

  // Statut d'ouverture
  async getOpenStatus(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/etablissements/${id}/statut-ouverture/`, { 
      next: { 
        revalidate: 60,
        tags: [`establishment-status-${id}`] 
      },
    });
    
    return handleResponse(response);
  },

  // Dans establishmentService, ajoute cette méthode
  async getRecent(days: number = 30) {
    const response = await fetch(`${API_BASE_URL}/api/v1/etablissements/recents/`, { 
      next: { 
        revalidate: CACHE_TIMES.FEATURED,
        tags: ['establishments', 'recent'] 
      },
    });
    
    if (!response.ok) {
      // Si l'endpoint n'existe pas, utiliser getAll avec tri
      const allResponse = await fetch(`${API_BASE_URL}/api/v1/etablissements/?page_size=50&ordering=-date_creation`, { 
        next: { 
          revalidate: CACHE_TIMES.FEATURED,
          tags: ['establishments', 'recent'] 
        },
      });
      
      const data = await handleResponse<any>(allResponse);
      
      // Filtrer côté client pour les 30 derniers jours
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      
      let establishments = data.results || data || [];
      
      // Filtrer par date
      establishments = establishments.filter((est: any) => {
        if (!est.date_creation && !est.created_at) return false;
        
        const createdDate = new Date(est.date_creation || est.created_at);
        return createdDate >= thirtyDaysAgo;
      });
      
      // Limiter à 4
      return { results: establishments.slice(0, 4) };
    }
    
    const data = await handleResponse<any>(response);
    if (Array.isArray(data)) {
      return { results: data.slice(0, 4) };
    }
    return data;
  },

  // Établissements à proximité
  async getNearby(params: {
    latitude: number;
    longitude: number;
    rayon?: number;
  }) {
    const queryParams = new URLSearchParams();
    queryParams.append('latitude', params.latitude.toString());
    queryParams.append('longitude', params.longitude.toString());
    if (params.rayon) queryParams.append('rayon', params.rayon.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/etablissements/nearby/?${queryParams}`, {
      next: { 
        revalidate: CACHE_TIMES.ESTABLISHMENTS,
        tags: ['establishments', 'nearby'] 
      },
    });
    
    return handleResponse(response);
  },
};

// Service pour les événements
export const eventService = {
  // Liste des événements
  async getAll(params?: {
    page?: number;
    page_size?: number;
    type?: string;
    etablissement_id?: string;
    a_venir?: boolean;
    gratuit?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.etablissement_id) queryParams.append('etablissement_id', params.etablissement_id);
    if (params?.a_venir !== undefined) queryParams.append('a_venir', params.a_venir.toString());
    if (params?.gratuit !== undefined) queryParams.append('gratuit', params.gratuit.toString());

    const url = `${API_BASE_URL}/api/v1/events/?${queryParams}`;
    
    const response = await fetch(url, { 
      next: { 
        revalidate: CACHE_TIMES.EVENTS,
        tags: ['events', `events-page-${params?.page || 1}`] 
      },
    });
    
    return handleResponse(response);
  },

  // Événements à venir
  async getUpcoming() {
    const response = await fetch(`${API_BASE_URL}/api/v1/events/a_venir/`, { 
      next: { 
        revalidate: CACHE_TIMES.EVENTS,
        tags: ['events', 'upcoming'] 
      },
    });
    
    const data = await handleResponse<any>(response);
    
    // Si c'est un tableau, le wrapper
    if (Array.isArray(data)) {
      return { results: data };
    }
    return data;
  },

  // Événements aujourd'hui
  async getToday() {
    const response = await fetch(`${API_BASE_URL}/api/v1/events/aujourd_hui/`, { 
      next: { 
        revalidate: 60,
        tags: ['events', 'today'] 
      },
    });
    
    const data = await handleResponse<any>(response);
    if (Array.isArray(data)) {
      return { results: data };
    }
    return data;
  },

  // Événements ce weekend
  async getThisWeekend() {
    const response = await fetch(`${API_BASE_URL}/api/v1/events/ce_weekend/`, { 
      next: { 
        revalidate: CACHE_TIMES.EVENTS,
        tags: ['events', 'weekend'] 
      },
    });
    
    const data = await handleResponse<any>(response);
    if (Array.isArray(data)) {
      return { results: data };
    }
    return data;
  },

  // Détail d'un événement
  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/events/${id}/`, { 
      next: { 
        revalidate: CACHE_TIMES.DETAIL,
        tags: ['events', `event-${id}`] 
      },
    });
    
    return handleResponse(response);
  },
};

// Service de recherche globale
export const searchService = {
  async search(query: string, limit: number = 10) {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/search/?${queryParams}`, {
      next: { 
        revalidate: 60,
        tags: ['search'] 
      },
    });
    
    return handleResponse(response);
  },

  async autocomplete(query: string) {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);

    const response = await fetch(`${API_BASE_URL}/api/v1/search/autocomplete/?${queryParams}`, {
      next: { 
        revalidate: 60,
        tags: ['autocomplete'] 
      },
    });
    
    return handleResponse(response);
  },
};

// Service de tracking
export const trackingService = {
  async trackVue(data: {
    etablissement: string;
    device_id?: string;
    duree_consultation?: number;
    source?: string;
  }) {
    try {
      await fetch(`${API_BASE_URL}/api/v1/tracking/vue-etablissement/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etablissement: data.etablissement,
          device_id: data.device_id || 'web-user',
          duree_consultation: data.duree_consultation || 0,
          source: data.source || 'direct'
        }),
        cache: 'no-store',
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  },

  async trackEventVue(data: {
    event: string;
    device_id?: string;
    source?: string;
  }) {
    try {
      await fetch(`${API_BASE_URL}/api/v1/tracking/vue-event/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: data.event,
          device_id: data.device_id || 'web-user',
          source: data.source || 'direct'
        }),
        cache: 'no-store',
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  },

  async trackSearch(data: {
    terme: string;
    device_id?: string;
    nombre_resultats?: number;
  }) {
    try {
      await fetch(`${API_BASE_URL}/api/v1/tracking/recherche/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          terme: data.terme,
          device_id: data.device_id || 'web-user',
          nombre_resultats: data.nombre_resultats || 0
        }),
        cache: 'no-store',
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  },
};