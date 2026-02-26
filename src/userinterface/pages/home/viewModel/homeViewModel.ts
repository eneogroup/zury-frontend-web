import DI from '../../../../di/ioc'
import type { IHomeViewModel } from '../../../../service/interface/home.viewmodel.interface'

export const homeViewModel = (): IHomeViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')

  const { getFeatured, getRecent } = DI.resolve<
    ReturnType<typeof import('../../../../infrastructure/controller/establishment.controller').establishmentController>
  >('establishmentController')

  const { getUpcoming: getUpcomingEvents, getWeekend: getWeekendEvents } =
    DI.resolve<any>('eventController')

  const { getStats } = DI.resolve<any>('categoryController')

  const { featuredEstablishments, recentEstablishments, featuredStatus } = DI.resolve<any>('establishmentPresenter')
  const { upcomingEvents, weekendEvents, upcomingStatus, weekendStatus } = DI.resolve<any>('eventPresenter')
  const { stats, statsStatus } = DI.resolve<any>('categoryPresenter')

  useEffect(() => {
    getFeatured()
    getRecent()
    getUpcomingEvents()
    getWeekendEvents()
    getStats()
  }, [])

  return {
    featuredEstablishments,
    recentEstablishments,
    upcomingEvents,
    weekendEvents,
    stats,
    featuredStatus,
    upcomingStatus,
    weekendStatus,
    statsStatus,
  }
}
