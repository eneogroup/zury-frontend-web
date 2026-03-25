import { useEffect } from 'react'
import DI from '../../../../di/ioc'

export const carteViewModel = () => {
  const useEffectHook = DI.resolve<typeof useEffect>('useEffect')
  const { getAll } = DI.resolve<any>('establishmentController')
  const { establishments, status } = DI.resolve<any>('establishmentPresenter')

  useEffectHook(() => {
    getAll({ page_size: 1000 })
  }, [])

  return { establishments, status }
}
