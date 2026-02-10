import { TextareaHTMLAttributes, useId } from 'react'

type FormTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string
  error?: string
  hint?: string
}

function FormTextarea({ label, error, hint, className = '', ...props }: FormTextareaProps) {
  const id = useId()

  const baseTextareaStyles =
    'block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors resize-y min-h-[100px]'
  const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50'

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        className={`${baseTextareaStyles} ${error ? errorStyles : normalStyles}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  )
}

export default FormTextarea
