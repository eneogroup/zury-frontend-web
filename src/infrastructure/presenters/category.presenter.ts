import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

export const categoryPresenter = () => {
  const { categories, quartiers, stats, status, statsStatus } = useSelector(
    (state: RootState) => state.category
  )
  return { categories, quartiers, stats, status, statsStatus }
}
