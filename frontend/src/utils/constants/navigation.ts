import { HomeIcon, PlusIcon } from '../../assets/svg/index.ts'
import type { NavigationSection } from '../types/navigation.ts'

/** The sidebar, top to bottom. */
export const NAVIGATION: NavigationSection[] = [
  {
    items: [{ label: 'Dashboard', to: '/dashboard', icon: HomeIcon }],
  },
  {
    heading: 'Task management',
    items: [{ label: 'Create task', to: '/tasks/create', icon: PlusIcon }],
  },
]
