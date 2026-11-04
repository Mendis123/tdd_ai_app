import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles.ts'
import { Spinner } from './Spinner.tsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
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
      className={`${buttonClassName(variant, size)} ${className}`}
      {...props}
    >
      {isLoading ? <Spinner className="size-4" /> : null}
      {children}
    </button>
  )
}
