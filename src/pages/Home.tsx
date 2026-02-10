import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  appendDemandFeedback,
  loadDemandFeedback,
  loadItems,
  loadUsageLogs,
  type DemandFeedback,
} from '../utils/storage'

const personaLabels: Record<DemandFeedback['targetUser'], string> = {
  collector: '器コレクター',
  newlywed: '新生活ユーザー',
  'gift-seeker': 'ギフト選びユーザー',
  cafeteria: '飲食店・カフェ担当',
  other: 'その他',
}

function Home() {
  const items = useMemo(() => loadItems(), [])
  const usageLogs = useMemo(() => loadUsageLogs(), [])
  const [feedbackList, setFeedbackList] = useState(() => loadDemandFeedback())
  const [targetUser, setTargetUser] = useState<DemandFeedback['targetUser']>('collector')
  const [painLevel, setPainLevel] = useState(4)
  const [weeklyUseIntent, setWeeklyUseIntent] = useState(4)
  const [recommendationIntent, setRecommendationIntent] = useState(4)
  const [note, setNote] = useState('')

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

  const usageLast7Days = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(now)
      date.setDate(now.getDate() - (6 - index))
      const key = date.toLocaleDateString('ja-JP')
      const count = usageLogs.filter(
        (log) => new Date(log.usedAt).toLocaleDateString('ja-JP') === key,
      ).length
      return { label: `${date.getMonth() + 1}/${date.getDate()}`, count }
    })
  }, [usageLogs])

  const streak = useMemo(() => {
    let days = 0
    const today = new Date()
    while (true) {
      const target = new Date(today)
      target.setDate(today.getDate() - days)
      const key = target.toLocaleDateString('ja-JP')
      const used = usageLogs.some((log) => new Date(log.usedAt).toLocaleDateString('ja-JP') === key)
      if (!used) {
        break
      }
      days += 1
    }
    return days
  }, [usageLogs])

  const demandScore = useMemo(() => {
    if (feedbackList.length === 0) {
      return 0
    }
    const total = feedbackList.reduce((sum, feedback) => {
      return sum + feedback.painLevel + feedback.weeklyUseIntent + feedback.recommendationIntent
    }, 0)
    return Number(((total / (feedbackList.length * 15)) * 100).toFixed(1))
  }, [feedbackList])

  const topPersona = useMemo(() => {
    if (feedbackList.length === 0) {
      return '未回答'
    }
    const counts = feedbackList.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.targetUser] = (acc[cur.targetUser] ?? 0) + 1
      return acc
    }, {})
    const persona = Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] as DemandFeedback['targetUser']
    return personaLabels[persona]
  }, [feedbackList])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleSubmitFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updated = appendDemandFeedback({
      targetUser,
      painLevel,
      weeklyUseIntent,
      recommendationIntent,
      note,
      submittedAt: new Date().toISOString(),
    })
    setFeedbackList(updated)
    setNote('')
  }

  const demandMessage =
    demandScore >= 75
      ? '需要が高い状態です。口コミ導線と写真共有機能の追加で拡大が期待できます。'
      : demandScore >= 50
        ? '需要は中程度です。コレクション整理と通知体験を磨くと継続率が上がります。'
        : '需要検証の初期段階です。ターゲットユーザーの課題をさらに収集しましょう。'

  return (
    <div className="animate-fade-in space-y-8">
      <section className="text-center py-10">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-3">
          器日記
        </h1>
        <p className="text-base text-slate-600 mb-8 max-w-md mx-auto">
          お気に入りの器を記録し、毎日の使用を振り返る
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl"
          >
            新しい器を登録
          </Link>
          <Link
            to="/shelf"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-300"
          >
            コレクションを見る
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{stats.itemsCount}</p>
          <p className="text-xs text-slate-500 mt-1">コレクション</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{stats.totalUses}</p>
          <p className="text-xs text-slate-500 mt-1">使用回数</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{stats.uniqueItemsUsed}</p>
          <p className="text-xs text-slate-500 mt-1">使用した器</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{streak}</p>
          <p className="text-xs text-slate-500 mt-1">連続記録日数</p>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-100 p-5">
        <h2 className="text-base font-bold text-slate-900 mb-4">直近7日間の使用トレンド</h2>
        <div className="grid grid-cols-7 gap-2 items-end h-36">
          {usageLast7Days.map((day) => (
            <div key={day.label} className="text-center">
              <div
                className="mx-auto w-full max-w-[28px] rounded-t bg-indigo-500/80"
                style={{ height: `${Math.max(day.count * 18, 8)}px` }}
              ></div>
              <p className="text-[10px] text-slate-500 mt-2">{day.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-100 p-5">
        <h2 className="text-base font-bold text-slate-900 mb-3">最近の使用履歴</h2>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-slate-500">まだ履歴がありません。最初の記録を始めましょう。</p>
        ) : (
          <ul className="space-y-2">
            {recentLogs.map((log) => (
              <li
                key={`${log.itemId}-${log.usedAt}`}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >
                <span className="text-sm font-medium text-slate-900">{log.itemName}</span>
                <span className="text-xs text-slate-500">{formatDate(log.usedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-base font-bold text-slate-900">需要検証ダッシュボード</h2>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
            回答 {feedbackList.length} 件
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg bg-white p-3 border border-indigo-100">
            <p className="text-xs text-slate-500">需要スコア</p>
            <p className="text-2xl font-bold text-indigo-700">{demandScore}%</p>
          </div>
          <div className="rounded-lg bg-white p-3 border border-indigo-100">
            <p className="text-xs text-slate-500">主要ターゲット</p>
            <p className="text-sm font-semibold text-slate-900">{topPersona}</p>
          </div>
          <div className="rounded-lg bg-white p-3 border border-indigo-100">
            <p className="text-xs text-slate-500">評価コメント</p>
            <p className="text-xs text-slate-700">{demandMessage}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmitFeedback}
          className="space-y-3 bg-white rounded-lg p-4 border border-slate-200"
        >
          <p className="text-sm font-semibold text-slate-900">アプリ価値アンケート（簡易）</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-xs text-slate-600">
              あなたの立場
              <select
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value as DemandFeedback['targetUser'])}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              >
                {Object.entries(personaLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-slate-600">
              現在の課題感（1-5）
              <input
                type="range"
                min={1}
                max={5}
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <label className="text-xs text-slate-600">
              週1回以上使いたい度（1-5）
              <input
                type="range"
                min={1}
                max={5}
                value={weeklyUseIntent}
                onChange={(e) => setWeeklyUseIntent(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <label className="text-xs text-slate-600">
              他者に勧めたい度（1-5）
              <input
                type="range"
                min={1}
                max={5}
                value={recommendationIntent}
                onChange={(e) => setRecommendationIntent(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="改善してほしい点（任意）"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            需要データを記録
          </button>
        </form>
      </section>
    </div>
  )
}

export default Home
