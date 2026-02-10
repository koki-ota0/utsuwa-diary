export type ItemCategory = 'Plate' | 'Cup' | 'Vase' | 'Bowl' | 'Misc'

export type StoredItem = {
  id: number
  name: string
  category: ItemCategory
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

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const API_BASE_URL = 'http://utsuwa-diary-backend:8080'

const request = async <T>(path: string, method: HttpMethod = 'GET', body?: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${method} ${path} (${response.status})`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

const safeRequest = async <T>(path: string, fallback: T, method: HttpMethod = 'GET', body?: unknown) => {
  try {
    return await request<T>(path, method, body)
  } catch (error) {
    console.error(error)
    return fallback
  }
}

export const loadItems = async (): Promise<StoredItem[]> => {
  return safeRequest<StoredItem[]>('/items', [])
}

export const createItem = async (item: Omit<StoredItem, 'id'>): Promise<StoredItem | null> => {
  return safeRequest<StoredItem | null>('/items', null, 'POST', item)
}

export const loadUsageLogs = async (): Promise<UsageLog[]> => {
  return safeRequest<UsageLog[]>('/usage-logs', [])
}

export const createUsageLog = async (log: UsageLog): Promise<UsageLog | null> => {
  return safeRequest<UsageLog | null>('/usage-logs', null, 'POST', log)
}

export const loadFavoriteItemIds = async (): Promise<number[]> => {
  return safeRequest<number[]>('/favorites', [])
}

export const toggleFavoriteItem = async (itemId: number): Promise<number[]> => {
  return safeRequest<number[]>('/favorites/toggle', [], 'POST', { itemId })
}

export const loadDemandFeedback = async (): Promise<DemandFeedback[]> => {
  return safeRequest<DemandFeedback[]>('/demand-feedback', [])
}

export const appendDemandFeedback = async (entry: DemandFeedback): Promise<DemandFeedback[]> => {
  return safeRequest<DemandFeedback[]>('/demand-feedback', [], 'POST', entry)
}

export const seedItemsIfNeeded = async (initialItems: StoredItem[]): Promise<boolean> => {
  const existingItems = await loadItems()

  if (existingItems.length > 0) {
    return false
  }

  const seeded = await safeRequest<StoredItem[]>('/items/seed', [], 'POST', { items: initialItems })
  return seeded.length > 0
}

export const deleteItem = async (id: number): Promise<void> => {
  await safeRequest<void>(`/items/${id}`, undefined, 'DELETE')
}

export const updateItem = async (id: number, updates: Partial<StoredItem>): Promise<StoredItem | null> => {
  return safeRequest<StoredItem | null>(`/items/${id}`, null, 'PATCH', updates)
}

export const getItemById = async (id: number): Promise<StoredItem | null> => {
  return safeRequest<StoredItem | null>(`/items/${id}`, null)
}
