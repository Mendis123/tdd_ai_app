import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, SignOutIcon } from '../components/icons.tsx'
import { Spinner } from '../components/ui/Spinner.tsx'
import { useAuth } from '../features/auth/useAuth.ts'

/** "Ada Lovelace" -> "AL"; falls back to the first character of the email. */
function toInitials(name: string, email: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (initials || email[0] || '?').toUpperCase()
}

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  /* Dismiss on Escape or an outside pointer, the two exits people expect. */
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  if (!user) {
    return null
  }

  async function handleSignOut() {
    setIsSigningOut(true)
    await signOut()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white"
        >
          {toInitials(user.name, user.email)}
        </span>
        <span className="hidden max-w-36 truncate text-sm font-medium text-slate-700 sm:block">
          {user.name}
        </span>
        <ChevronDownIcon
          className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
        <span className="sr-only">Account menu</span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-900/5"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none disabled:opacity-60"
          >
            {isSigningOut ? (
              <Spinner className="size-4 text-slate-400" />
            ) : (
              <SignOutIcon className="size-4 text-slate-400" />
            )}
            {isSigningOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
