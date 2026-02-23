import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

export const establishmentPresenter = () => {
  const {
    establishments,
    featuredEstablishments,
    recentEstablishments,
    currentEstablishment,
    similarEstablishments,
    status,
    featuredStatus,
    recentStatus,
    detailStatus,
    totalCount,
    totalPages,
  } = useSelector((state: RootState) => state.establishment)

  return {
    establishments,
    featuredEstablishments,
    recentEstablishments,
    currentEstablishment,
    similarEstablishments,
    status,
    featuredStatus,
    recentStatus,
    detailStatus,
    totalCount,
    totalPages,
  }
}
