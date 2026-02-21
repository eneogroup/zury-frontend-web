import { cache } from 'react';
import { 
  establishmentService, 
  eventService, 
  categoryService, 
  quartierService,
  statsService,
  searchService,
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
  getOpenStatus: cache(establishmentService.getOpenStatus),
  getNearby: cache(establishmentService.getNearby),
  getRecent: cache(establishmentService.getRecent),
  getSimilar : cache(establishmentService.getSimilar),
};

export const cachedEventService = {
  getAll: cache(eventService.getAll),
  getUpcoming: cache(eventService.getUpcoming),
  getToday: cache(eventService.getToday),
  getThisWeekend: cache(eventService.getThisWeekend),
  getById: cache(eventService.getById),
};

export const cachedCategoryService = {
  getAll: cache(categoryService.getAll),
};

export const cachedQuartierService = {
  getAll: cache(quartierService.getAll),
};

export const cachedStatsService = {
  getGlobalStats: cache(statsService.getGlobalStats),
};

export const cachedSearchService = {
  search: cache(searchService.search),
  autocomplete: cache(searchService.autocomplete),
};