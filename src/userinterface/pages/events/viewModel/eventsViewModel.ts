import { useSearchParams } from 'react-router-dom'
import DI from '../../../../di/ioc'
import type { IEventsViewModel } from '../../../../service/interface/events.viewmodel.interface'

export const eventsViewModel = (): IEventsViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')
  const [searchParams] = useSearchParams()

  const { getAll, getUpcoming, getToday, getThisWeek, getWeekend } = DI.resolve<any>('eventController')
  const { 
    events: allEvents, 
    upcomingEvents, 
    todayEvents, 
    thisWeekEvents, 
    weekendEvents, 
    status: allStatus, 
    upcomingStatus, 
    todayStatus, 
    thisWeekStatus, 
    weekendStatus, 
    totalCount, 
    totalPages 
  } = DI.resolve<any>('eventPresenter')

  const period = searchParams.get('period') || 'all'
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    switch (period) {
      case 'today':
        getToday()
        break
      case 'this_week':
        getThisWeek()
        break
      case 'weekend':
        getWeekend()
        break
      case 'all':
        getAll({ page, page_size: 50, a_venir: false })
        break
      default: // 'upcoming'
        getUpcoming()
        break
    }
  }, [period, page])

  let displayEvents = allEvents;
  let displayStatus = allStatus;

  switch (period) {
    case 'today': displayEvents = todayEvents; displayStatus = todayStatus; break;
    case 'this_week': displayEvents = thisWeekEvents; displayStatus = thisWeekStatus; break;
    case 'weekend': displayEvents = weekendEvents; displayStatus = weekendStatus; break;
    case 'upcoming': displayEvents = upcomingEvents; displayStatus = upcomingStatus; break;
    case 'all': default: displayEvents = allEvents; displayStatus = allStatus; break;
  }

  return { events: displayEvents, status: displayStatus, totalCount, totalPages }
}
