import { useMemo, useState } from 'react'
import { loadUsageLogs, type ItemCategory, type UsageLog } from '../utils/storage'
import { Badge, EmptyState } from '../components/common'
import CategoryFilter from '../components/common/CategoryFilter'

type FilterCategory = ItemCategory | 'all'

type GroupedLogs = {
  date: string
  logs: UsageLog[]
}

function UsageHistory() {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const logs = useMemo(() => loadUsageLogs(), [])

  const filteredLogs = useMemo(() => {
    if (filterCategory === 'all') {
      return logs
    }
    return logs.filter((log) => log.category === filterCategory)
  }, [logs, filterCategory])

  const groupedLogs = useMemo(() => {
    const groups: Record<string, UsageLog[]> = {}

    filteredLogs.forEach((log) => {
      const date = new Date(log.usedAt).toLocaleDateString('ja-JP')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(log)
    })

    return Object.entries(groups).map(
      ([date, logs]): GroupedLogs => ({
        date,
        logs,
      })
    )
  }, [filteredLogs])

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDateHeader = (dateString: string) => {
    const today = new Date().toLocaleDateString('ja-JP')
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('ja-JP')

    if (dateString === today) {
      return '今日'
    } else if (dateString === yesterday) {
      return '昨日'
    }
    return dateString
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-2">
          使用履歴
        </h1>
        <p className="text-slate-500">
          合計 <span className="font-semibold text-indigo-600">{filteredLogs.length}</span> 回使用
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter value={filterCategory} onChange={setFilterCategory} />
      </div>

      {groupedLogs.length === 0 ? (
        <EmptyState
          title="まだ使用履歴がありません"
          description="マイシェルフで「今日使った」をタップして記録を始めましょう"
        />
      ) : (
        <div className="space-y-8">
          {groupedLogs.map((group) => (
            <section key={group.date}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  {formatDateHeader(group.date)}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                <span className="text-sm text-slate-400 font-medium">
                  {group.logs.length}件
                </span>
              </div>
              <ul className="space-y-3">
                {group.logs.map((log, index) => (
                  <li
                    key={`${log.itemId}-${log.usedAt}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">{log.itemName}</span>
                        <div className="mt-1">
                          <Badge category={log.category} />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                      {formatTime(log.usedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default UsageHistory
