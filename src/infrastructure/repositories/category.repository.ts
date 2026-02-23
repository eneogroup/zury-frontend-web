import { CategoryGateway } from '../gateways/category.gateway'
import { StatsGateway } from '../gateways/stats.gateway'

export const categoryRepository = {
  getAll: async () => {
    const { error, data } = await new CategoryGateway().getAll()
    return { error, categories: Array.isArray(data) ? data : (data?.results || []) }
  },

  getQuartiers: async (ville_id?: string) => {
    const { error, data } = await new CategoryGateway().getQuartiers(ville_id)
    return { error, quartiers: Array.isArray(data) ? data : (data?.results || []) }
  },
}

export const statsRepository = {
  getGlobalStats: async () => {
    const { error, data } = await new StatsGateway().getGlobalStats()
    return { error, stats: data || null }
  },
}
