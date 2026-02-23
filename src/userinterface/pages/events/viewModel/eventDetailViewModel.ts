import { useParams } from 'react-router-dom'
import DI from '../../../../di/ioc'
import type { IEventDetailViewModel } from '../../../../service/interface/events.viewmodel.interface'

export const eventDetailViewModel = (): IEventDetailViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')
  const { id } = useParams<{ id: string }>()

  const { getById } = DI.resolve<any>('eventController')
  const { currentEvent, detailStatus } = DI.resolve<any>('eventPresenter')

  useEffect(() => {
    if (id) getById(id)
  }, [id])

  return { currentEvent, detailStatus }
}
