import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner.tsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
  children: ReactNode
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-brand-600',
  secondary:
    'bg-white text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-slate-600',
}

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      /* A loading button stays focusable but inert, so focus is not lost mid-submit. */
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {isLoading ? <Spinner className="size-4" /> : null}
      {children}
    </button>
  )
}
