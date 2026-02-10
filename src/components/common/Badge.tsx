import { HTMLAttributes } from 'react'
import type { ItemCategory } from '../../utils/storage'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  category: ItemCategory
}

const categoryStyles: Record<ItemCategory, string> = {
  Plate: 'bg-blue-100 text-blue-700',
  Cup: 'bg-amber-100 text-amber-700',
  Vase: 'bg-green-100 text-green-700',
  Bowl: 'bg-purple-100 text-purple-700',
  Misc: 'bg-gray-100 text-gray-700',
}

function Badge({ category, className = '', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

  return (
    <span className={`${baseStyles} ${categoryStyles[category]} ${className}`} {...props}>
      {category}
    </span>
  )
}

export default Badge
