import type { StoredItem } from '../utils/storage'

const createdAt = new Date().toISOString()

export const initialItems: StoredItem[] = [
  {
    id: 1,
    name: '藍色のディナープレート',
    category: 'Plate',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80',
    createdAt,
  },
  {
    id: 2,
    name: '手作りの湯呑み',
    category: 'Cup',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=800&q=80',
    createdAt,
  },
  {
    id: 3,
    name: '陶器のボウル',
    category: 'Bowl',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=800&q=80',
    createdAt,
  },
  {
    id: 4,
    name: 'ミニマルな花瓶',
    category: 'Vase',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    createdAt,
  },
]
