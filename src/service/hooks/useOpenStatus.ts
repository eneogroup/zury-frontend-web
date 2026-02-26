import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://zury-backend-production.up.railway.app'

type OpenStatus = 'open' | 'closed' | 'unknown'

const cache = new Map<string, OpenStatus>()

export function useOpenStatus(id: string, enabled = true) {
  const [status, setStatus] = useState<OpenStatus>(() => cache.get(id) ?? 'unknown')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled || !id) return
    if (cache.has(id)) {
      setStatus(cache.get(id)!)
      return
    }
    let cancelled = false
    setLoading(true)
    axios
      .get(`${BASE_URL}/api/v1/etablissements/${id}/statut-ouverture/`)
      .then((res) => {
        if (cancelled) return
        const data = res.data?.data ?? res.data
        const isOpen = data?.est_ouvert === true || data?.is_open === true || data?.statut === 'ouvert'
        const result: OpenStatus = isOpen ? 'open' : 'closed'
        cache.set(id, result)
        setStatus(result)
      })
      .catch(() => {
        if (!cancelled) setStatus('unknown')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id, enabled])

  return { status, loading }
}
