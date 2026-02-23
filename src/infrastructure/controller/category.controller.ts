import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
import { getCategories, getQuartiers, getGlobalStats } from '../../domain/usecase/category.usecase'

export const categoryController = () => {
  const dispatch = useDispatch<AppDispatch>()
  return {
    getCategories: () => dispatch(getCategories()),
    getQuartiers: (ville_id?: string) => dispatch(getQuartiers(ville_id)),
    getStats: () => dispatch(getGlobalStats()),
  }
}
