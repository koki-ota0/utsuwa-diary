import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  getItemById,
  loadItems,
  saveItems,
  updateItem,
  type ItemCategory,
} from '../utils/storage'

const categories: ItemCategory[] = ['Plate', 'Cup', 'Vase', 'Bowl', 'Misc']

const categoryLabels: Record<ItemCategory, string> = {
  Plate: '皿',
  Cup: 'カップ・湯呑み',
  Vase: '花瓶',
  Bowl: '鉢・ボウル',
  Misc: 'その他',
}

const categoryIcons: Record<ItemCategory, string> = {
  Plate: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  Cup: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V4h6v12M13 4h-2v2m0 0H9m2 0v8',
  Vase: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  Bowl: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
  Misc: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
}

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('画像の読み込みに失敗しました。'))
    reader.readAsDataURL(file)
  })

const ItemRegister = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ItemCategory>('Plate')
  const [brandShop, setBrandShop] = useState('')
  const [notes, setNotes] = useState('')
  const [existingThumbnail, setExistingThumbnail] = useState('')

  useEffect(() => {
    if (id) {
      const item = getItemById(Number(id))
      if (item) {
        setName(item.name)
        setCategory(item.category)
        setBrandShop(item.brandShop ?? '')
        setNotes(item.notes ?? '')
        setExistingThumbnail(item.thumbnailUrl)
      }
    }
  }, [id])

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      setPhoto(selectedFile)
      setPhotoPreview(await readFileAsDataURL(selectedFile))
    } else {
      setPhoto(null)
      setPhotoPreview('')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isEditMode && id) {
      const thumbnailUrl = photo ? await readFileAsDataURL(photo) : existingThumbnail

      updateItem(Number(id), {
        name,
        category,
        thumbnailUrl,
        brandShop,
        notes,
      })

      navigate('/shelf')
      return
    }

    const existingItems = loadItems()
    const thumbnailUrl = photo ? await readFileAsDataURL(photo) : ''
    const nextId =
      existingItems.length > 0 ? Math.max(...existingItems.map((item) => item.id)) + 1 : 1

    const newItem = {
      id: nextId,
      name,
      category,
      thumbnailUrl,
      brandShop,
      notes,
      createdAt: new Date().toISOString(),
    }

    saveItems([newItem, ...existingItems])

    setPhoto(null)
    setPhotoPreview('')
    setName('')
    setCategory('Plate')
    setBrandShop('')
    setNotes('')

    console.log('Saved item to localStorage:', newItem)
    navigate('/shelf')
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/shelf"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          マイシェルフに戻る
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? '器を編集' : '器を登録'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isEditMode ? 'コレクションの情報を更新します' : 'あなたのコレクションに新しい器を追加'}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Photo Upload Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">写真</h2>
              <p className="text-xs text-slate-500">1枚</p>
            </div>
          </div>

          {/* Photo Preview */}
          {(photoPreview || (isEditMode && existingThumbnail && !photo)) && (
            <div className="mb-4">
              <div className="relative aspect-square max-w-48 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={photoPreview || existingThumbnail}
                  alt={photoPreview ? 'プレビュー画像' : '現在の画像'}
                  className="w-full h-full object-cover"
                />
                {!photoPreview && (
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                    現在の画像
                  </div>
                )}
              </div>
            </div>
          )}

          <label
            htmlFor="photos"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all duration-200"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-slate-500">
                <span className="font-medium text-indigo-600">クリックして選択</span>
                {' '}またはドラッグ＆ドロップ
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, HEIC</p>
            </div>
            <input
              id="photos"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-xs text-slate-500 text-center">{photo ? '1 / 1 枚選択中' : '未選択'}</p>
        </div>

        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-semibold text-slate-900">基本情報</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                placeholder="例: 益子焼の湯呑み"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="category">
                カテゴリ
              </label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                      category === cat
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryIcons[cat]} />
                    </svg>
                    <span className="text-xs font-medium">{categoryLabels[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">詳細情報</h2>
              <p className="text-xs text-slate-500">任意入力</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="brandShop">
                ブランド / 購入店
              </label>
              <input
                id="brandShop"
                type="text"
                value={brandShop}
                onChange={(event) => setBrandShop(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                placeholder="例: 〇〇窯、△△陶器市"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="notes">
                メモ
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 resize-none"
                placeholder="特徴や思い出、使い心地など"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isEditMode ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              更新する
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              登録する
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ItemRegister
