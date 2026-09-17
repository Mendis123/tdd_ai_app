import { NavLink } from 'react-router'
import { BrandMark } from '../components/BrandMark.tsx'
import { CloseIcon, HomeIcon } from '../components/icons.tsx'

const NAVIGATION = [{ label: 'Dashboard', to: '/dashboard', icon: HomeIcon }]

type SidebarProps = {
  /** Drawer state; below `lg` the sidebar is off-canvas. */
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Scrim: click-to-dismiss on touch, and it dims the content behind the drawer. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-8" />
            <span className="text-base font-semibold tracking-tight text-slate-900">
              Personal Tracker
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="-mr-1 grid size-9 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAVIGATION.map(({ label, to, icon: NavIcon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <NavIcon
                        className={`size-5 shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
