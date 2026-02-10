import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteItem,
  loadItems,
  loadUsageLogs,
  saveUsageLogs,
  seedItemsIfNeeded,
  type ItemCategory,
  type StoredItem,
} from '../utils/storage'
import { ItemCard } from '../components/common'
import CategoryFilter from '../components/common/CategoryFilter'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { initialItems } from '../constants/initialItems'

type FilterCategory = ItemCategory | 'all'

const categoryLabels: Record<ItemCategory, string> = {
  Plate: '皿',
  Cup: 'カップ・湯呑み',
  Vase: '花瓶',
  Bowl: '鉢・ボウル',
  Misc: 'その他',
}

const MyShelf = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState<StoredItem[]>(() => loadItems())

  const [usageLogCount, setUsageLogCount] = useState<number>(() => loadUsageLogs().length)
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [deleteTarget, setDeleteTarget] = useState<StoredItem | null>(null)

  useEffect(() => {
    const seeded = seedItemsIfNeeded(initialItems)
    if (seeded) {
      setItems(loadItems())
    }
  }, [])

  const filteredItems = useMemo(() => {
    if (filterCategory === 'all') {
      return items
    }
    return items.filter((item) => item.category === filterCategory)
  }, [items, filterCategory])

  const handleUsedToday = (item: StoredItem) => {
    const currentLogs = loadUsageLogs()

    const updatedLogs = [
      {
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        usedAt: new Date().toISOString(),
      },
      ...currentLogs,
    ]

    saveUsageLogs(updatedLogs)
    setUsageLogCount(updatedLogs.length)
    console.log(`Used Today: ${item.name} (${item.category})`)
  }

  const handleEdit = (item: StoredItem) => {
    navigate(`/edit/${item.id}`)
  }

  const handleDelete = (item: StoredItem) => {
    setDeleteTarget(item)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteItem(deleteTarget.id)
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  const cancelDelete = () => {
    setDeleteTarget(null)
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">マイシェルフ</h1>
        <p className="mt-2 text-base text-gray-600">あなたのコレクション</p>
        <p className="mt-1 text-xs text-gray-400">使用記録: {usageLogCount}件</p>
      </header>

      <div className="mb-8">
        <CategoryFilter value={filterCategory} onChange={setFilterCategory} />
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          {filterCategory === 'all' ? (
            <>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">まだ器が登録されていません</h3>
              <p className="mb-6 text-sm text-gray-500">最初の器を登録して、コレクションを始めましょう</p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                器を登録する
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-500">「{categoryLabels[filterCategory]}」カテゴリに器がありません</p>
          )}
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUsedToday={handleUsedToday}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="削除の確認"
        message={`「${deleteTarget?.name}」を削除しますか？この操作は取り消せません。`}
        confirmLabel="削除"
        cancelLabel="キャンセル"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        variant="danger"
      />
    </div>
  )
}

export default MyShelf
