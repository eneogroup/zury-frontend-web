import { useParams } from 'react-router-dom'
import DI from '../../../../di/ioc'
import type { IEstablishmentDetailViewModel } from '../../../../service/interface/establishment.viewmodel.interface'

export const establishmentDetailViewModel = (): IEstablishmentDetailViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')
  const { id } = useParams<{ id: string }>()

  const { getById, getSimilar } = DI.resolve<any>('establishmentController')
  const { currentEstablishment, similarEstablishments, detailStatus } = DI.resolve<any>('establishmentPresenter')

  useEffect(() => {
    if (id) {
      getById(id)
      getSimilar(id)
    }
  }, [id])

  return { currentEstablishment, similarEstablishments, detailStatus }
}
