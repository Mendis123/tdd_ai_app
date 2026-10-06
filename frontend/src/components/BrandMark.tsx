import { CheckIcon } from '../assets/svg/index.ts'

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
      <CheckIcon className="size-5" />
    </span>
  )
}
