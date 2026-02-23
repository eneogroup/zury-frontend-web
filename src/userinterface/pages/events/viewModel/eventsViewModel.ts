import { useSearchParams } from 'react-router-dom'
import DI from '../../../../di/ioc'
import type { IEventsViewModel } from '../../../../service/interface/events.viewmodel.interface'

export const eventsViewModel = (): IEventsViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')
  const [searchParams] = useSearchParams()

  const { getAll, getUpcoming, getToday, getWeekend } = DI.resolve<any>('eventController')
  const { events, status, totalCount, totalPages } = DI.resolve<any>('eventPresenter')

  const period = searchParams.get('period') || 'all'
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    switch (period) {
      case 'today': getToday(); break
      case 'weekend': getWeekend(); break
      default: getUpcoming(); break
    }
  }, [period, page])

  return { events: period === 'all' || period === 'upcoming' ? events : events, status, totalCount, totalPages }
}
