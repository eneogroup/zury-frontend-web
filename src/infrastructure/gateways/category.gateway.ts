import axios from 'axios'
import { SingletonMixin } from '../../service/utils/singleton.mixin'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api-zury.eneogroup.site'

export class CategoryGateway extends SingletonMixin() {
  private async handleResponse(response: any) {
    const json = response.data
    if (json.success && json.data !== undefined) return json.data
    return json
  }

  async getAll() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/categories/`)
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  async getQuartiers(ville_id?: string) {
    try {
      const url = ville_id
        ? `${BASE_URL}/api/v1/quartiers/?ville=${ville_id}`
        : `${BASE_URL}/api/v1/quartiers/`
      const response = await axios.get(url)
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }
}
