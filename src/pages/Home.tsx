import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { loadItems, loadUsageLogs } from '../utils/storage'

function Home() {
  const items = useMemo(() => loadItems(), [])
  const usageLogs = useMemo(() => loadUsageLogs(), [])

  const stats = useMemo(() => {
    const uniqueItemsUsed = new Set(usageLogs.map((log) => log.itemId)).size
    return {
      itemsCount: items.length,
      totalUses: usageLogs.length,
      uniqueItemsUsed,
    }
  }, [items, usageLogs])

  const recentLogs = useMemo(() => {
    return [...usageLogs]
      .sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime())
      .slice(0, 3)
  }, [usageLogs])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-12 mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-3">
          器日記
        </h1>
        <p className="text-base text-slate-600 mb-8 max-w-md mx-auto">
          お気に入りの器を記録し、毎日の使用を振り返る
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新しい器を登録
          </Link>
          <Link
            to="/shelf"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            コレクションを見る
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center transition-all duration-300 hover:shadow-md cursor-default">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.itemsCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">コレクション</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center transition-all duration-300 hover:shadow-md cursor-default">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalUses}
          </p>
          <p className="text-xs text-slate-500 mt-1">使用回数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center transition-all duration-300 hover:shadow-md cursor-default">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.uniqueItemsUsed}
          </p>
          <p className="text-xs text-slate-500 mt-1">使用した器</p>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">最近の使用履歴</h2>
          <Link
            to="/history"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors flex items-center gap-1"
          >
            すべて見る
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {recentLogs.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {recentLogs.map((log, index) => (
              <li key={`${log.itemId}-${log.usedAt}-${index}`} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{log.itemName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{log.category}</p>
                  </div>
                  <p className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                    {formatDate(log.usedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">
              まだ使用履歴がありません
            </p>
            <p className="text-xs text-slate-400 mt-1">
              器を使ったら記録してみましょう
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
