import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
import {
  getAllEvents,
  getUpcomingEvents,
  getTodayEvents,
  getWeekendEvents,
  getEventById,
} from '../../domain/usecase/event.usecase'

export const eventController = () => {
  const dispatch = useDispatch<AppDispatch>()
  return {
    getAll: (params?: any) => dispatch(getAllEvents(params)),
    getUpcoming: () => dispatch(getUpcomingEvents()),
    getToday: () => dispatch(getTodayEvents()),
    getWeekend: () => dispatch(getWeekendEvents()),
    getById: (id: string) => dispatch(getEventById(id)),
  }
}
