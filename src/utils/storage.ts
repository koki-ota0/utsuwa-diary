export type ItemCategory = 'Plate' | 'Cup' | 'Vase' | 'Bowl' | 'Misc'

export type StoredItem = {
  id: number
  name: string
  category: ItemCategory
  // 画像が未登録のアイテムも許容するため任意フィールド
  thumbnailUrl?: string
  brandShop?: string
  notes?: string
  createdAt: string
}

export type UsageLog = {
  itemId: number
  itemName: string
  category: ItemCategory
  usedAt: string
}

export type DemandFeedback = {
  targetUser: 'collector' | 'newlywed' | 'gift-seeker' | 'cafeteria' | 'other'
  painLevel: number
  weeklyUseIntent: number
  recommendationIntent: number
  note?: string
  submittedAt: string
}

const STORAGE_KEYS = {
  items: 'utsuwa-diary-items',
  usageLogs: 'utsuwa-diary-usage-logs',
  initialItemsSeeded: 'utsuwa-diary-initial-items-seeded',
  favoriteItemIds: 'utsuwa-diary-favorite-item-ids',
  demandFeedback: 'utsuwa-diary-demand-feedback',
} as const

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const saveItems = (items: StoredItem[]): void => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items))
}

export const loadItems = (): StoredItem[] => {
  if (!canUseStorage()) {
    return []
  }

  return safeParse<StoredItem[]>(window.localStorage.getItem(STORAGE_KEYS.items), [])
}

export const saveUsageLogs = (logs: UsageLog[]): void => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.usageLogs, JSON.stringify(logs))
}

export const loadUsageLogs = (): UsageLog[] => {
  if (!canUseStorage()) {
    return []
  }

  return safeParse<UsageLog[]>(window.localStorage.getItem(STORAGE_KEYS.usageLogs), [])
}

export const loadFavoriteItemIds = (): number[] => {
  if (!canUseStorage()) {
    return []
  }

  return safeParse<number[]>(window.localStorage.getItem(STORAGE_KEYS.favoriteItemIds), [])
}

export const saveFavoriteItemIds = (itemIds: number[]): void => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.favoriteItemIds, JSON.stringify(itemIds))
}

export const toggleFavoriteItem = (itemId: number): number[] => {
  const current = loadFavoriteItemIds()
  const updated = current.includes(itemId)
    ? current.filter((id) => id !== itemId)
    : [itemId, ...current]

  saveFavoriteItemIds(updated)
  return updated
}

export const loadDemandFeedback = (): DemandFeedback[] => {
  if (!canUseStorage()) {
    return []
  }

  return safeParse<DemandFeedback[]>(window.localStorage.getItem(STORAGE_KEYS.demandFeedback), [])
}

export const saveDemandFeedback = (feedback: DemandFeedback[]): void => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.demandFeedback, JSON.stringify(feedback))
}

export const appendDemandFeedback = (entry: DemandFeedback): DemandFeedback[] => {
  const current = loadDemandFeedback()
  const updated = [entry, ...current]
  saveDemandFeedback(updated)
  return updated
}

export const hasInitialItemsSeeded = (): boolean => {
  if (!canUseStorage()) {
    return false
  }

  return window.localStorage.getItem(STORAGE_KEYS.initialItemsSeeded) === 'true'
}

export const markInitialItemsSeeded = (): void => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.initialItemsSeeded, 'true')
}

export const seedItemsIfNeeded = (initialItems: StoredItem[]): boolean => {
  if (!canUseStorage() || hasInitialItemsSeeded()) {
    return false
  }

  saveItems(initialItems)
  markInitialItemsSeeded()
  return true
}

export const deleteItem = (id: number): void => {
  const items = loadItems()
  saveItems(items.filter((item) => item.id !== id))

  const favorites = loadFavoriteItemIds()
  if (favorites.includes(id)) {
    saveFavoriteItemIds(favorites.filter((favoriteId) => favoriteId !== id))
  }
}

export const updateItem = (id: number, updates: Partial<StoredItem>): void => {
  const items = loadItems()
  const index = items.findIndex((item) => item.id === id)
  if (index !== -1) {
    items[index] = { ...items[index], ...updates }
    saveItems(items)
  }
}

export const getItemById = (id: number): StoredItem | undefined => {
  const items = loadItems()
  return items.find((item) => item.id === id)
}
