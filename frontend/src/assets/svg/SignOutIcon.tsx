import { Icon, type IconProps } from './Icon.tsx'

export function SignOutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 17l5-5-5-5M20 12H9M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
    </Icon>
  )
}
