import React from 'react'
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import type { ToastMessage } from '../../types/index.ts'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAero()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon text-emerald-400" size={18} />
      case 'warning':
        return <AlertTriangle className="toast-icon text-amber-400" size={18} />
      case 'error':
        return <AlertCircle className="toast-icon text-red-400" size={18} />
      default:
        return <Info className="toast-icon text-cyan-400" size={18} />
    }
  }

  return (
    <div className={`toast-card toast-${toast.type}`}>
      <div className="toast-icon-wrap">{getIcon()}</div>
      <div className="toast-content">
        <h4 className="toast-title">{toast.title}</h4>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="toast-close"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  )
}
