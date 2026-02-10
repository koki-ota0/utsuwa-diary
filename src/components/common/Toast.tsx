import { useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info'

type ToastProps = {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
}

function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg animate-slide-up ${typeStyles[type]}`}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

export default Toast
