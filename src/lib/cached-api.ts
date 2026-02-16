import { cache } from 'react';
import { 
  establishmentService, 
  eventService, 
  categoryService, 
  quartierService 
} from './api';

/**
 * Version cached des services API
 * Utilise React cache() pour dédupliquer les requêtes dans un même render
 */

export const cachedEstablishmentService = {
  getAll: cache(establishmentService.getAll),
  getFeatured: cache(establishmentService.getFeatured),
  search: cache(establishmentService.search),
  getById: cache(establishmentService.getById),
};

export const cachedEventService = {
  getAll: cache(eventService.getAll),
  getById: cache(eventService.getById),
};

export const cachedCategoryService = {
  getAll: cache(categoryService.getAll),
};

export const cachedQuartierService = {
  getAll: cache(quartierService.getAll),
};