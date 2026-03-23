import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import {
  useGetUserFavoritesQuery,
  useToggleEstablishmentFavoriteMutation,
  useToggleEventFavoriteMutation,
} from '../../store/apiSlice'

export type FavoriteItem = {
  id: string
  type: 'establishment' | 'event'
  name: string
  imageUrl: string
  subtitle: string
  savedAt: number
}

const STORAGE_KEY = 'zury_favorites'

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useFavorites() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  
  // Local storage state for guests
  const [localFavorites, setLocalFavorites] = useState<FavoriteItem[]>(() => loadFavorites())

  // Network state for members
  const { data: remoteData, refetch } = useGetUserFavoritesQuery(undefined, { skip: !isAuthenticated })
  const [toggleEstab] = useToggleEstablishmentFavoriteMutation()
  const [toggleEvt] = useToggleEventFavoriteMutation()

  // Save guest favorites to local storage automatically
  useEffect(() => {
    if (!isAuthenticated) {
      saveFavorites(localFavorites)
    }
  }, [localFavorites, isAuthenticated])

  // Compute unified favorites list based on auth state
  const favorites: FavoriteItem[] = useMemo(() => {
    if (!isAuthenticated) return localFavorites

    if (!remoteData) return []
    
    // Transform backend generic response into FavoriteItem struct array
    const mapped: FavoriteItem[] = []
    
    // Depending on backend payload format, here we extract items:
    const etabs = remoteData.etablissements || []
    const events = remoteData.events || []

    etabs.forEach((e: any) => {
      mapped.push({
        id: e.id,
        type: 'establishment',
        name: e.nom,
        imageUrl: e.image_principale || '/placeholder.jpg',
        subtitle: e.categorie_nom || e.categorie?.nom || '',
        savedAt: Date.now(), // Real time stamp from backend favoris table if available?
      })
    })

    events.forEach((ev: any) => {
      mapped.push({
        id: ev.id,
        type: 'event',
        name: ev.titre,
        imageUrl: ev.affiche_url || '/placeholder-event.jpg',
        subtitle: ev.type_event_display || ev.type_event || 'Événement',
        savedAt: Date.now(),
      })
    })

    return mapped
  }, [isAuthenticated, localFavorites, remoteData])

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (item: FavoriteItem) => {
      if (isAuthenticated) {
        // Network sync path
        try {
          if (item.type === 'establishment') {
            await toggleEstab(item.id).unwrap()
          } else {
            await toggleEvt(item.id).unwrap()
          }
          refetch() // Reload fresh data after successful operation
        } catch (error) {
          console.error("Erreur de synchronisation du favori", error)
        }
      } else {
        // Local path
        if (isFavorite(item.id)) {
          setLocalFavorites((prev) => prev.filter((f) => f.id !== item.id))
        } else {
          setLocalFavorites((prev) => [{ ...item, savedAt: Date.now() }, ...prev])
        }
      }
    },
    [isAuthenticated, isFavorite, toggleEstab, toggleEvt, refetch]
  )

  // Explicit handlers mapped heavily across app
  const addFavorite = useCallback((item: FavoriteItem) => toggleFavorite(item), [toggleFavorite])
  const removeFavorite = useCallback((id: string) => {
    const f = favorites.find(x => x.id === id)
    if (f) toggleFavorite(f)
  }, [favorites, toggleFavorite])

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }
}
