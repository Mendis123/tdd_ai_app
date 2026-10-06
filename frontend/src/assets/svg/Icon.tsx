import type { SVGProps } from 'react'

/** Props shared by every icon: anything an `<svg>` accepts, typically a sizing `className`. */
export type IconProps = SVGProps<SVGSVGElement>

/**
 * Base for the inline single-colour icons. Each inherits `currentColor` and is
 * marked `aria-hidden`, so the accessible name always comes from the control
 * that wraps it rather than from the artwork.
 */
export function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}
