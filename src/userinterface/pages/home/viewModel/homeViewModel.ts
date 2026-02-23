import DI from '../../../../di/ioc'
import type { IHomeViewModel } from '../../../../service/interface/home.viewmodel.interface'

export const homeViewModel = (): IHomeViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')

  const { getFeatured, getRecent } = DI.resolve<
    ReturnType<typeof import('../../../../infrastructure/controller/establishment.controller').establishmentController>
  >('establishmentController')

  const { getUpcoming, getStats } = DI.resolve<
    ReturnType<typeof import('../../../../infrastructure/controller/event.controller').eventController> &
    ReturnType<typeof import('../../../../infrastructure/controller/category.controller').categoryController>
  >('categoryController') as any

  const { getUpcoming: getUpcomingEvents } = DI.resolve<any>('eventController')

  const { featuredEstablishments, recentEstablishments, featuredStatus } = DI.resolve<any>('establishmentPresenter')
  const { upcomingEvents, upcomingStatus } = DI.resolve<any>('eventPresenter')
  const { stats, statsStatus } = DI.resolve<any>('categoryPresenter')

  useEffect(() => {
    getFeatured()
    getRecent()
    getUpcomingEvents()
    getStats()
  }, [])

  return {
    featuredEstablishments,
    recentEstablishments,
    upcomingEvents,
    stats,
    featuredStatus,
    upcomingStatus,
    statsStatus,
  }
}
