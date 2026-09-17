import { Spinner } from './ui/Spinner.tsx'

/** Shown while the stored token is being validated on boot. */
export function FullPageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-50" role="status" aria-live="polite">
      <Spinner className="size-7 text-brand-600" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
