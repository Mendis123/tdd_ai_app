import type { ComponentType } from 'react'
import type { IconProps } from '../../assets/svg/index.ts'

export type NavigationItem = {
  label: string
  to: string
  icon: ComponentType<IconProps>
}

/** A group of sidebar links; the heading is omitted for the top-level group. */
export type NavigationSection = {
  heading?: string
  items: NavigationItem[]
}
