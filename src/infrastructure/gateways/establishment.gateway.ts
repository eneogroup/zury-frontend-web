import { SingletonMixin } from '../../service/utils/singleton.mixin'
import { store } from '../../store/store'
import { apiSlice } from '../../store/apiSlice'

export class EstablishmentGateway extends SingletonMixin() {
  private async handleResponse(responseData: any) {
    const json = responseData
    if (json.success && json.data !== undefined) return json.data
    return json
  }

  async getAll(params?: {
    page?: number
    page_size?: number
    categorie?: string
    quartier?: string
    note_min?: number
    search?: string
    ordering?: string
  }) {
    try {
      const result = await store.dispatch(apiSlice.endpoints.getEstablishments.initiate(params)).unwrap()
      return { data: await this.handleResponse(result), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getFeatured() {
    try {
      const result = await store.dispatch(apiSlice.endpoints.getFeaturedEstablishments.initiate()).unwrap()
      const data = await this.handleResponse(result)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getRecent() {
    try {
      const result = await store.dispatch(apiSlice.endpoints.getRecentEstablishments.initiate()).unwrap()
      const data = await this.handleResponse(result)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getById(id: string) {
    try {
      const result = await store.dispatch(apiSlice.endpoints.getEstablishmentById.initiate(id)).unwrap()
      return { data: await this.handleResponse(result), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getSimilar(id: string) {
    try {
      const result = await store.dispatch(apiSlice.endpoints.getSimilarEstablishments.initiate(id)).unwrap()
      return { data: await this.handleResponse(result), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async search(q: string, lat?: number, lng?: number) {
    try {
      const params: any = { q }
      if (lat !== undefined) params.latitude = lat
      if (lng !== undefined) params.longitude = lng
      const result = await store.dispatch(apiSlice.endpoints.searchGlobal.initiate(params)).unwrap()
      return { data: await this.handleResponse(result), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getOpenStatus(id: string) {
    // This is generally unused now but preserved for interface compatibility.
    // The open status is fetched natively via the EtablissementListSerializer now!
    try {
      const result = await store.dispatch(apiSlice.endpoints.getEstablishmentById.initiate(id)).unwrap()
      return { data: await this.handleResponse(result), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async trackView(payload: {
    etablissement: string
    device_id: string
    duree_consultation: number
    source: string
  }) {
    try {
      await store.dispatch(apiSlice.endpoints.trackView.initiate(payload)).unwrap()
    } catch {
      // Silently fail — tracking should never block the UI
    }
  }
}
