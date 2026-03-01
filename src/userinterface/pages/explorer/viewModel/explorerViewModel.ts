import { useSearchParams } from 'react-router-dom'
import DI from '../../../../di/ioc'
import type { IExplorerViewModel } from '../../../../service/interface/explorer.viewmodel.interface'

export const explorerViewModel = (): IExplorerViewModel => {
  const useEffect = DI.resolve<typeof import('react').useEffect>('useEffect')
  const [urlParams] = useSearchParams()

  const { getAll, search, getCategories, getQuartiers } = {
    ...DI.resolve<any>('establishmentController'),
    ...DI.resolve<any>('categoryController'),
  }

  const { establishments, status, totalCount, totalPages } = DI.resolve<any>('establishmentPresenter')
  const { categories, quartiers } = DI.resolve<any>('categoryPresenter')

  const q           = urlParams.get('q') || ''
  const categorie   = urlParams.get('categorie') || ''
  const neighborhood = urlParams.get('neighborhood') || ''
  const minRating   = urlParams.get('minRating') || ''
  const ordering    = urlParams.get('ordering') || ''
  const quickFilter = urlParams.get('quickFilter') || ''
  const lat         = urlParams.get('lat') ? parseFloat(urlParams.get('lat')!) : undefined
  const lng         = urlParams.get('lng') ? parseFloat(urlParams.get('lng')!) : undefined
  const page        = parseInt(urlParams.get('page') || '1')

  // Use the smart search endpoint for all filtered queries (categorie, quickFilter, text)
  // "Tous" (categorie='') falls back to getAll to load everything
  const shouldUseSearch = !!(quickFilter || q || categorie)

  const buildSearchQ = (): string => {
    // Compose colon-separated pattern: categorie:ouvert:quartier
    const parts: string[] = []
    if (categorie && categorie !== 'all') parts.push(categorie)
    if (quickFilter === 'ouvert') parts.push('ouvert')
    // neighborhood only appended when a category is already set (pattern requirement)
    if (neighborhood && categorie) parts.push(neighborhood)

    if (parts.length > 0) {
      let composed = parts.join(':')
      if (q) composed += ' ' + q
      return composed
    }

    // Standalone quick filter keywords (gratuit, aujourd'hui, pas cher, luxe, proche)
    if (quickFilter) return quickFilter

    // Plain text search
    return q
  }

  useEffect(() => {
    getCategories()
    getQuartiers()

    if (shouldUseSearch) {
      const composed = buildSearchQ()
      if (composed) search({ q: composed, lat, lng })
    } else {
      const params: any = { page, page_size: 12 }
      if (categorie && categorie !== 'all') params.categorie = categorie
      if (neighborhood) params.quartier = neighborhood
      if (minRating) params.note_min = parseFloat(minRating)
      if (ordering) params.ordering = ordering
      getAll(params)
    }
  }, [q, categorie, neighborhood, minRating, ordering, page, quickFilter, lat, lng])

  return { establishments, categories, quartiers, status, totalCount, totalPages }
}
