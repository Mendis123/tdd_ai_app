import { MenuIcon } from '../components/icons.tsx'
import { UserMenu } from './UserMenu.tsx'

export function Navbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="-ml-1 grid size-9 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden"
      >
        <MenuIcon className="size-5" />
      </button>

      <div className="flex-1" />

      <UserMenu />
    </header>
  )
}
