/**
 * The product mark. Decorative by default: the wordmark beside it carries the
 * accessible name.
 */
export function BrandMark({ className = 'size-9' }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.2 4.2L19 7" />
      </svg>
    </span>
  )
}
