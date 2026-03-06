import { useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import DI from '../../../../di/ioc'
import type { IEstablishmentDetailViewModel } from '../../../../service/interface/establishment.viewmodel.interface'
import { EstablishmentGateway } from '../../../../infrastructure/gateways/establishment.gateway'
import { getDeviceId } from '../../../../service/utils/deviceId'

export const establishmentDetailViewModel = (): IEstablishmentDetailViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')
  const { id } = useParams<{ id: string }>()
  const location = useLocation()

  const { getById, getSimilar } = DI.resolve<any>('establishmentController')
  const { currentEstablishment, similarEstablishments, detailStatus } = DI.resolve<any>('establishmentPresenter')

  useEffect(() => {
    if (id) {
      getById(id)
      getSimilar(id)
    }
  }, [id])

  // Tracking — start timer on mount, fire POST on unmount
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!id) return
    startRef.current = Date.now()
    // Source injected via Link state from the originating page (e.g. "explorer", "accueil")
    const source: string = (location.state as any)?.trackingSource ?? 'direct'

    return () => {
      const duree = Math.round((Date.now() - startRef.current) / 1000)
      new EstablishmentGateway().trackView({
        etablissement: id,
        device_id: getDeviceId(),
        duree_consultation: duree,
        source,
      })
    }
  }, [id])

  return { currentEstablishment, similarEstablishments, detailStatus }
}
