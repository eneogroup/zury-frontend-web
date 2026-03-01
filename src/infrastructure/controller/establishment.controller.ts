import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
import {
  getAllEstablishments,
  getFeaturedEstablishments,
  getRecentEstablishments,
  getEstablishmentById,
  getSimilarEstablishments,
  searchEstablishments,
} from '../../domain/usecase/establishment.usecase'

export const establishmentController = () => {
  const dispatch = useDispatch<AppDispatch>()
  return {
    getAll: (params?: any) => dispatch(getAllEstablishments(params)),
    search: (params: { q: string; lat?: number; lng?: number }) => dispatch(searchEstablishments(params)),
    getFeatured: () => dispatch(getFeaturedEstablishments()),
    getRecent: () => dispatch(getRecentEstablishments()),
    getById: (id: string) => dispatch(getEstablishmentById(id)),
    getSimilar: (id: string) => dispatch(getSimilarEstablishments(id)),
  }
}
