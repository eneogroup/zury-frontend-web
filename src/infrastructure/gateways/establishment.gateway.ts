import axios from 'axios'
import { SingletonMixin } from '../../service/utils/singleton.mixin'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://zury-backend-production.up.railway.app'

export class EstablishmentGateway extends SingletonMixin() {
  private async handleResponse(response: any) {
    const json = response.data
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
      const response = await axios.get(`${BASE_URL}/api/v1/etablissements/`, { params })
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getFeatured() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/etablissements/featured/`)
      const data = await this.handleResponse(response)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getRecent() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/etablissements/recents/`)
      const data = await this.handleResponse(response)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getById(id: string) {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/etablissements/${id}/`)
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getSimilar(id: string) {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/etablissements/${id}/similaires/?limit=8`)
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async search(q: string, lat?: number, lng?: number) {
    try {
      const params: any = { q }
      if (lat !== undefined) params.latitude = lat
      if (lng !== undefined) params.longitude = lng
      const response = await axios.get(`${BASE_URL}/api/v1/search/`, { params })
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getOpenStatus(id: string) {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/etablissements/${id}/statut-ouverture/`)
      return { data: await this.handleResponse(response), error: null }
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
      await axios.post(`${BASE_URL}/api/v1/tracking/vue-etablissement/`, payload)
    } catch {
      // Silently fail — tracking should never block the UI
    }
  }
}
