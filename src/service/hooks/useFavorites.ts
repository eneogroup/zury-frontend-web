import { useState, useEffect, useCallback } from 'react'

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
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  )

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id)) return prev
      return [{ ...item, savedAt: Date.now() }, ...prev]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id)
      } else {
        addFavorite(item)
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  )

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }
}
