import { EstablishmentGateway } from '../gateways/establishment.gateway'
import { transformEstablishment, transformEstablishmentDetail } from '../../service/utils/apiTransformers'

export const establishmentRepository = {
  getAll: async (params?: any) => {
    const { error, data } = await new EstablishmentGateway().getAll(params)
    if (error || !data) return { error, establishments: [], totalCount: 0, totalPages: 0 }
    const results = (data.results || []).map(transformEstablishment)
    return {
      error: null,
      establishments: results,
      totalCount: data.count || results.length,
      totalPages: data.total_pages || Math.ceil((data.count || results.length) / (params?.page_size || 12)),
    }
  },

  search: async (q: string, lat?: number, lng?: number) => {
    const { error, data } = await new EstablishmentGateway().search(q, lat, lng)
    if (error || !data) return { error, establishments: [], totalCount: 0, totalPages: 0 }
    // Response shape: { total, resultats: { etablissements: { count, data[] }, events: { count, data[] } } }
    const etab = data?.resultats?.etablissements
    const rawList: any[] = etab?.data ?? (Array.isArray(data) ? data : (data.results || []))
    const results = rawList.map(transformEstablishment)
    const count = etab?.count ?? data.total ?? results.length
    return {
      error: null,
      establishments: results,
      totalCount: count,
      totalPages: 1,
    }
  },

  getFeatured: async () => {
    const { error, data } = await new EstablishmentGateway().getFeatured()
    if (error || !data) return { error, establishments: [] }
    const results = (data.results || []).map(transformEstablishment)
    return { error: null, establishments: results }
  },

  getRecent: async () => {
    const { error, data } = await new EstablishmentGateway().getRecent()
    if (error || !data) return { error, establishments: [] }
    const results = (data.results || []).map(transformEstablishment)
    return { error: null, establishments: results.slice(0, 4) }
  },

  getById: async (id: string) => {
    const { error, data } = await new EstablishmentGateway().getById(id)
    if (error || !data) return { error, establishment: null }
    return { error: null, establishment: transformEstablishmentDetail(data) }
  },

  getSimilar: async (id: string) => {
    const { error, data } = await new EstablishmentGateway().getSimilar(id)
    if (error || !data) return { error, establishments: [] }
    const results = Array.isArray(data) ? data : (data.results || [])
    return { error: null, establishments: results.map(transformEstablishment) }
  },

  getOpenStatus: async (id: string) => {
    const { error, data } = await new EstablishmentGateway().getOpenStatus(id)
    return { error, isOpen: data?.est_ouvert ?? null }
  },
}
