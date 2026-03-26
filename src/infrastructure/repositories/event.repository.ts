import { EventGateway } from '../gateways/event.gateway'
import { transformEvent } from '../../service/utils/apiTransformers'

export const eventRepository = {
  getAll: async (params?: any) => {
    const { error, data } = await new EventGateway().getAll(params)
    if (error || !data) return { error, events: [], totalCount: 0, totalPages: 0 }
    const results = (data.results || []).map(transformEvent)
    return {
      error: null,
      events: results,
      totalCount: data.count || results.length,
      totalPages: data.total_pages || Math.ceil((data.count || results.length) / (params?.page_size || 12)),
    }
  },

  getUpcoming: async () => {
    const { error, data } = await new EventGateway().getUpcoming()
    if (error || !data) return { error, events: [] }
    return { error: null, events: (data.results || []).map(transformEvent) }
  },

  getToday: async () => {
    const { error, data } = await new EventGateway().getToday()
    if (error || !data) return { error, events: [] }
    const list = data.events || data.results || []
    return { error: null, events: list.map(transformEvent) }
  },

  getThisWeekend: async () => {
    const { error, data } = await new EventGateway().getThisWeekend()
    if (error || !data) return { error, events: [] }
    const list = data.events || data.results || []
    return { error: null, events: list.map(transformEvent) }
  },

  getThisWeek: async () => {
    const { error, data } = await new EventGateway().getThisWeek()
    if (error || !data) return { error, events: [] }
    const list = data.events || data.results || []
    return { error: null, events: list.map(transformEvent) }
  },

  getById: async (id: string) => {
    const { error, data } = await new EventGateway().getById(id)
    if (error || !data) return { error, event: null }
    return { error: null, event: transformEvent(data) }
  },
}
