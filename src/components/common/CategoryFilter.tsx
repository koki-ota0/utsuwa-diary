import type { ItemCategory } from '../../utils/storage'

type FilterCategory = ItemCategory | 'all'

type CategoryFilterProps = {
  value: FilterCategory
  onChange: (category: FilterCategory) => void
}

const categories: FilterCategory[] = ['all', 'Plate', 'Cup', 'Vase', 'Bowl', 'Misc']

const categoryLabels: Record<FilterCategory, string> = {
  all: 'すべて',
  Plate: '皿',
  Cup: 'カップ・湯呑み',
  Vase: '花瓶',
  Bowl: '鉢・ボウル',
  Misc: 'その他',
}

function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
            value === category
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
          }`}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
