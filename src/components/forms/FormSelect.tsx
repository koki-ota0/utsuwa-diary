import { SelectHTMLAttributes, useId } from 'react'

type SelectOption = {
  value: string
  label: string
}

type FormSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string
  options: SelectOption[]
  error?: string
  placeholder?: string
}

function FormSelect({
  label,
  options,
  error,
  placeholder,
  className = '',
  ...props
}: FormSelectProps) {
  const id = useId()

  const baseSelectStyles =
    'block w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors appearance-none bg-white bg-no-repeat bg-right'
  const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50'

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`${baseSelectStyles} ${error ? errorStyles : normalStyles}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormSelect
