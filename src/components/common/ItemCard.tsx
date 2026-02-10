import type { StoredItem } from '../../utils/storage'
import Card from './Card'
import Badge from './Badge'
import Button from './Button'

type ItemCardProps = {
  item: StoredItem
  onUsedToday?: (item: StoredItem) => void
  onEdit?: (item: StoredItem) => void
  onDelete?: (item: StoredItem) => void
}

function ItemCard({ item, onUsedToday, onEdit, onDelete }: ItemCardProps) {
  return (
    <Card hover padding="none" className="overflow-hidden group">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={item.thumbnailUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge category={item.category} />
        </div>
        <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
        {item.brandShop && <p className="text-sm text-gray-500 truncate mb-3">{item.brandShop}</p>}
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
