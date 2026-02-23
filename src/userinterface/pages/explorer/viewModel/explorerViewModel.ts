import { useSearchParams } from 'react-router-dom'
import DI from '../../../../di/ioc'
import type { IExplorerViewModel } from '../../../../service/interface/explorer.viewmodel.interface'

export const explorerViewModel = (): IExplorerViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')
  const [searchParams] = useSearchParams()

  const { getAll, getCategories, getQuartiers } = {
    ...DI.resolve<any>('establishmentController'),
    ...DI.resolve<any>('categoryController'),
  }

  const { establishments, status, totalCount, totalPages } = DI.resolve<any>('establishmentPresenter')
  const { categories, quartiers } = DI.resolve<any>('categoryPresenter')

  const q = searchParams.get('q') || ''
  const categorie = searchParams.get('categorie') || ''
  const neighborhood = searchParams.get('neighborhood') || ''
  const minRating = searchParams.get('minRating') || ''
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    const params: any = { page, page_size: 12 }
    if (q) params.search = q
    if (categorie && categorie !== 'all') params.categorie = categorie
    if (neighborhood) params.quartier = neighborhood
    if (minRating) params.note_min = parseFloat(minRating)
    getAll(params)
    getCategories()
    getQuartiers()
  }, [q, categorie, neighborhood, minRating, page])

  return { establishments, categories, quartiers, status, totalCount, totalPages }
}
