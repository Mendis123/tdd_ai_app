import type { ReactNode } from 'react'
import { AlertIcon } from '../icons.tsx'

/**
 * Assertive status message for a failed action.
 *
 * `role="alert"` is on a wrapper that is always mounted by the caller only when
 * there is something to say, so screen readers announce the message the moment
 * it appears.
 */
export function Alert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-lg bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200 ring-inset"
    >
      <AlertIcon className="mt-px size-4.5 shrink-0 text-red-600" />
      <p>{children}</p>
    </div>
  )
}
