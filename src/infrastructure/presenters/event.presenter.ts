import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

export const eventPresenter = () => {
  const {
    events,
    upcomingEvents,
    currentEvent,
    status,
    upcomingStatus,
    detailStatus,
    totalCount,
    totalPages,
  } = useSelector((state: RootState) => state.event)

  return {
    events,
    upcomingEvents,
    currentEvent,
    status,
    upcomingStatus,
    detailStatus,
    totalCount,
    totalPages,
  }
}
