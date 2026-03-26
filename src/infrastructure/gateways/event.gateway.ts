import axios from 'axios'
import { SingletonMixin } from '../../service/utils/singleton.mixin'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api-zury.eneogroup.site'

export class EventGateway extends SingletonMixin() {
  private async handleResponse(response: any) {
    const json = response.data
    if (json.success && json.data !== undefined) return json.data
    return json
  }

  async getAll(params?: {
    page?: number
    page_size?: number
    type?: string
    etablissement_id?: string
    a_venir?: boolean
    gratuit?: boolean
  }) {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/events/`, { params })
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getUpcoming() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/events/a_venir/`)
      const data = await this.handleResponse(response)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getToday() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/events/aujourd_hui/`)
      const data = await this.handleResponse(response)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getThisWeekend() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/events/ce_weekend/`)
      const data = await this.handleResponse(response)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getThisWeek() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/events/cette_semaine/`)
      const data = await this.handleResponse(response)
      return { data: Array.isArray(data) ? { results: data } : data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getById(id: string) {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/events/${id}/`)
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }
}
