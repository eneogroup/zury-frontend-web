import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

export const eventPresenter = () => {
  const {
    events,
    upcomingEvents,
    weekendEvents,
    currentEvent,
    status,
    upcomingStatus,
    weekendStatus,
    detailStatus,
    totalCount,
    totalPages,
  } = useSelector((state: RootState) => state.event)

  return {
    events,
    upcomingEvents,
    weekendEvents,
    currentEvent,
    status,
    upcomingStatus,
    weekendStatus,
    detailStatus,
    totalCount,
    totalPages,
  }
}
