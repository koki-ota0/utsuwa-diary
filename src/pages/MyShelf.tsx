import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteItem,
  loadFavoriteItemIds,
  loadItems,
  loadUsageLogs,
  saveUsageLogs,
  seedItemsIfNeeded,
  toggleFavoriteItem,
  type ItemCategory,
  type StoredItem,
} from '../utils/storage'
import { ItemCard } from '../components/common'
import CategoryFilter from '../components/common/CategoryFilter'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { initialItems } from '../constants/initialItems'

type FilterCategory = ItemCategory | 'all'
type SortMode = 'newest' | 'name' | 'most-used'
type ViewMode = 'grid' | 'list'

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
  const [usageLogs, setUsageLogs] = useState(() => loadUsageLogs())
  const usageLogCount = usageLogs.length
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [deleteTarget, setDeleteTarget] = useState<StoredItem | null>(null)
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favoriteItemIds, setFavoriteItemIds] = useState<number[]>(() => loadFavoriteItemIds())

  useEffect(() => {
    const seeded = seedItemsIfNeeded(initialItems)
    if (seeded) {
      setItems(loadItems())
    }
  }, [])

  const usageMap = useMemo(() => {
    const map = new Map<number, number>()
    usageLogs.forEach((log) => {
      map.set(log.itemId, (map.get(log.itemId) ?? 0) + 1)
    })
    return map
  }, [usageLogs])

  const filteredItems = useMemo(() => {
    const searched = items.filter((item) => {
      if (filterCategory !== 'all' && item.category !== filterCategory) {
        return false
      }

      if (favoritesOnly && !favoriteItemIds.includes(item.id)) {
        return false
      }

      if (!query.trim()) {
        return true
      }

      const source = `${item.name} ${item.brandShop ?? ''} ${item.notes ?? ''}`.toLowerCase()
      return source.includes(query.toLowerCase().trim())
    })

    return searched.sort((a, b) => {
      if (sortMode === 'name') {
        return a.name.localeCompare(b.name, 'ja')
      }
      if (sortMode === 'most-used') {
        return (usageMap.get(b.id) ?? 0) - (usageMap.get(a.id) ?? 0)
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [items, filterCategory, favoritesOnly, favoriteItemIds, query, sortMode, usageMap])

  const topUsedItemName = useMemo(() => {
    const top = items
      .map((item) => ({ item, count: usageMap.get(item.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)[0]
    return top && top.count > 0 ? `${top.item.name} (${top.count}回)` : 'まだ記録がありません'
  }, [items, usageMap])

  const handleUsedToday = (item: StoredItem) => {
    const updatedLogs = [
      {
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        usedAt: new Date().toISOString(),
      },
      ...usageLogs,
    ]

    saveUsageLogs(updatedLogs)
    setUsageLogs(updatedLogs)
    console.log(`Used Today: ${item.name} (${item.category})`)
  }

  const handleEdit = (item: StoredItem) => {
    navigate(`/edit/${item.id}`)
  }

  const handleDelete = (item: StoredItem) => {
    setDeleteTarget(item)
  }

  const handleToggleFavorite = (item: StoredItem) => {
    const updated = toggleFavoriteItem(item.id)
    setFavoriteItemIds(updated)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteItem(deleteTarget.id)
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
      setFavoriteItemIds((prev) => prev.filter((id) => id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  const cancelDelete = () => {
    setDeleteTarget(null)
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">マイシェルフ</h1>
        <p className="mt-2 text-base text-gray-600">あなたのコレクション</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">登録数</p>
          <p className="text-xl font-bold text-slate-900">{items.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">使用記録</p>
          <p className="text-xl font-bold text-indigo-600">{usageLogCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">最も使う器</p>
          <p className="text-sm font-semibold text-slate-900 truncate">{topUsedItemName}</p>
        </div>
      </section>

      <div className="mb-4">
        <CategoryFilter value={filterCategory} onChange={setFilterCategory} />
      </div>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.35-4.65a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="器名・購入店・メモで検索"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            aria-label="並び順"
          >
            <option value="newest">新しい順</option>
            <option value="name">名前順</option>
            <option value="most-used">使用回数順</option>
          </select>
          <button
            type="button"
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={`rounded-xl px-3 py-2 text-sm font-medium ${favoritesOnly ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}
          >
            お気に入りのみ
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">{filteredItems.length}件を表示中</p>
          <div className="inline-flex rounded-lg border border-slate-200 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              グリッド
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              リスト
            </button>
          </div>
        </div>
      </section>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          {filterCategory === 'all' ? (
            <>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                まだ器が登録されていません
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                最初の器を登録して、コレクションを始めましょう
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                器を登録する
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              「{categoryLabels[filterCategory]}」カテゴリに器がありません
            </p>
          )}
        </div>
      ) : (
        <section
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          }
        >
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUsedToday={handleUsedToday}
              onEdit={handleEdit}
              onDelete={handleDelete}
              usageCount={usageMap.get(item.id) ?? 0}
              isFavorite={favoriteItemIds.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
              layout={viewMode}
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
