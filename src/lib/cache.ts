import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Utilitaires pour invalider le cache Next.js
 * À utiliser quand les données changent (ex: après création/modification)
 */

export const cacheUtils = {
  // Invalider toutes les pages d'établissements
  revalidateEstablishments: () => {
    revalidateTag('establishments');
    revalidatePath('/explorer');
    revalidatePath('/');
  },

  // Invalider un établissement spécifique
  revalidateEstablishment: (id: string) => {
    revalidateTag(`establishment-${id}`);
    revalidatePath(`/establishments/${id}`);
  },

  // Invalider tous les événements
  revalidateEvents: () => {
    revalidateTag('events');
    revalidatePath('/evenements');
    revalidatePath('/');
  },

  // Invalider un événement spécifique
  revalidateEvent: (id: string) => {
    revalidateTag(`event-${id}`);
    revalidatePath(`/evenements/${id}`);
  },

  // Invalider les featured
  revalidateFeatured: () => {
    revalidateTag('featured');
    revalidatePath('/');
  },

  // Invalider tout
  revalidateAll: () => {
    revalidateTag('establishments');
    revalidateTag('events');
    revalidateTag('categories');
    revalidateTag('quartiers');
    revalidatePath('/');
    revalidatePath('/explorer');
    revalidatePath('/evenements');
  },
};