import type { StoredItem } from '../../utils/storage'
import Card from './Card'
import Badge from './Badge'
import Button from './Button'

type ItemCardProps = {
  item: StoredItem
  onUsedToday?: (item: StoredItem) => void
  onEdit?: (item: StoredItem) => void
  onDelete?: (item: StoredItem) => void
  isFavorite?: boolean
  usageCount?: number
  layout?: 'grid' | 'list'
  onToggleFavorite?: (item: StoredItem) => void
}

function ItemCard({
  item,
  onUsedToday,
  onEdit,
  onDelete,
  isFavorite = false,
  usageCount = 0,
  layout = 'grid',
  onToggleFavorite,
}: ItemCardProps) {
  const hasThumbnail = Boolean(item.thumbnailUrl)

  return (
    <Card
      hover
      padding="none"
      className={`overflow-hidden group ${layout === 'list' ? 'sm:flex sm:min-h-[200px]' : ''}`}
    >
      <div
        className={`overflow-hidden bg-gray-100 ${layout === 'list' ? 'sm:w-64 sm:flex-shrink-0 aspect-square sm:aspect-auto' : 'aspect-square'}`}
      >
        {hasThumbnail ? (
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium">画像なし</p>
          </div>
        )}
      </div>
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge category={item.category} />
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(item)}
              aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M11.995 21.438l-1.432-1.308C5.205 15.284 2 12.373 2 8.82 2 5.908 4.29 3.62 7.2 3.62c1.646 0 3.226.77 4.255 1.996 1.03-1.227 2.61-1.996 4.255-1.996 2.91 0 5.2 2.288 5.2 5.2 0 3.553-3.204 6.464-8.563 11.319l-1.352 1.299z"
                />
              </svg>
            </button>
          )}
        </div>
        <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
        {item.brandShop && <p className="text-sm text-gray-500 truncate mb-2">{item.brandShop}</p>}
        <p className="text-xs text-slate-500 mb-3">累計使用 {usageCount} 回</p>
        <div className="flex flex-wrap gap-2">
          {onUsedToday && (
            <Button variant="primary" size="sm" onClick={() => onUsedToday(item)}>
              今日使った
            </Button>
          )}
          <div className="flex gap-1 ml-auto">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                title="編集"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                title="削除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ItemCard
