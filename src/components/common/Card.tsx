import { HTMLAttributes, PropsWithChildren } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

type CardProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    hover?: boolean
    padding?: CardPadding
  }>

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
}

function Card({ hover = false, padding = 'md', className = '', children, ...props }: CardProps) {
  const baseStyles = 'bg-white rounded-xl border border-gray-200 shadow-sm'
  const hoverStyles = hover ? 'transition-shadow hover:shadow-md cursor-pointer' : ''

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
