import { revalidatePath } from 'next/cache';

/**
 * Utilitaires pour invalider le cache Next.js
 * À utiliser quand les données changent (ex: après création/modification)
 */

export const cacheUtils = {
  // Invalider toutes les pages d'établissements
  revalidateEstablishments: async () => {
    await revalidatePath('/explorer');
    await revalidatePath('/');
  },

  // Invalider un établissement spécifique
  revalidateEstablishment: async (id: string) => {
    await revalidatePath(`/establishments/${id}`);
  },

  // Invalider tous les événements
  revalidateEvents: async () => {
    await revalidatePath('/evenements');
    await revalidatePath('/');
  },

  // Invalider un événement spécifique
  revalidateEvent: async (id: string) => {
    await revalidatePath(`/evenements/${id}`);
  },

  // Invalider les featured
  revalidateFeatured: async () => {
    await revalidatePath('/');
  },

  // Invalider tout
  revalidateAll: async () => {
    await revalidatePath('/');
    await revalidatePath('/explorer');
    await revalidatePath('/evenements');
  },
};