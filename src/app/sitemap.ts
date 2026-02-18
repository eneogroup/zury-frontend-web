import { MetadataRoute } from 'next';
import { establishmentService, eventService, categoryService } from '@/lib/api';

const BASE_URL = 'https://zury-web.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/explorer`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/evenements`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/carte`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/rejoindre-zury`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/eneo-academy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Pages de catégories
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categoriesResponse = await categoryService.getAll();
    const categories = (categoriesResponse as any) || [];
    
    categoryPages = categories.map((category: any) => ({
      url: `${BASE_URL}/explorer?categorie=${category.value}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error('Error loading categories for sitemap:', error);
  }

  // Établissements dynamiques
  let establishmentPages: MetadataRoute.Sitemap = [];
  try {
    const response = await establishmentService.getAll({ 
      page: 1, 
      page_size: 1000
    });
    
    const establishments = (response as any)?.results || response || [];
    
    establishmentPages = establishments.map((establishment: any) => ({
      url: `${BASE_URL}/establishments/${establishment.id}`,
      lastModified: establishment.date_modification 
        ? new Date(establishment.date_modification) 
        : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error loading establishments for sitemap:', error);
  }

  // Événements dynamiques
  let eventPages: MetadataRoute.Sitemap = [];
  try {
    const response = await eventService.getUpcoming();
    const events = (response as any)?.results || response || [];
    
    eventPages = events.map((event: any) => ({
      url: `${BASE_URL}/evenements/${event.id}`,
      lastModified: event.date_modification 
        ? new Date(event.date_modification) 
        : new Date(event.date_debut),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error loading events for sitemap:', error);
  }

  // Combiner toutes les pages
  return [
    ...staticPages, 
    ...categoryPages, 
    ...establishmentPages, 
    ...eventPages
  ];
}