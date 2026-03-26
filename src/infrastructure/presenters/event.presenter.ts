import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

export const eventPresenter = () => {
  const {
    events,
    upcomingEvents,
    todayEvents,
    thisWeekEvents,
    weekendEvents,
    currentEvent,
    status,
    upcomingStatus,
    todayStatus,
    thisWeekStatus,
    weekendStatus,
    detailStatus,
    totalCount,
    totalPages,
  } = useSelector((state: RootState) => state.event)

  return {
    events,
    upcomingEvents,
    todayEvents,
    thisWeekEvents,
    weekendEvents,
    currentEvent,
    status,
    upcomingStatus,
    todayStatus,
    thisWeekStatus,
    weekendStatus,
    detailStatus,
    totalCount,
    totalPages,
  }
}
