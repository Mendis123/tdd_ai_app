import { Icon, type IconProps } from './Icon.tsx'

/** The brand glyph. Drawn heavier than the UI icons; pass `strokeWidth` to override. */
export function CheckIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2.25} {...props}>
      <path d="m5 12.5 4.2 4.2L19 7" />
    </Icon>
  )
}
