import axios from 'axios'
import { SingletonMixin } from '../../service/utils/singleton.mixin'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api-zury.eneogroup.site'

export class StatsGateway extends SingletonMixin() {
  private async handleResponse(response: any) {
    const json = response.data
    if (json.success && json.data !== undefined) return json.data
    return json
  }

  async getGlobalStats() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/tracking/stats/`)
      return { data: await this.handleResponse(response), error: null }
    } catch (error) {
      return { error, data: null }
    }
  }
}
