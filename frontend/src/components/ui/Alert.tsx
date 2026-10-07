import type { ReactNode } from 'react'
import { AlertIcon, CheckCircleIcon } from '../../assets/svg/index.ts'

type AlertVariant = 'error' | 'success'

const VARIANTS: Record<AlertVariant, { role: 'alert' | 'status'; container: string; icon: string }> = {
  error: {
    role: 'alert',
    container: 'bg-red-50 text-red-800 ring-red-200',
    icon: 'text-red-600',
  },
  success: {
    role: 'status',
    container: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    icon: 'text-emerald-600',
  },
}

/**
 * Status message for the outcome of an action.
 *
 * The caller mounts it only when there is something to say, so screen readers
 * announce the message the moment it appears: assertively (`role="alert"`) for
 * a failure, politely (`role="status"`) for a success.
 */
export function Alert({ variant = 'error', children }: { variant?: AlertVariant; children: ReactNode }) {
  const { role, container, icon } = VARIANTS[variant]
  const StatusIcon = variant === 'success' ? CheckCircleIcon : AlertIcon

  return (
    <div
      role={role}
      className={`flex items-start gap-2.5 rounded-lg p-3 text-sm ring-1 ring-inset ${container}`}
    >
      <StatusIcon className={`mt-px size-4.5 shrink-0 ${icon}`} />
      <p>{children}</p>
    </div>
  )
}
