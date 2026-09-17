import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { Navbar } from './Navbar.tsx'
import { Sidebar } from './Sidebar.tsx'

/**
 * The signed-in shell: a persistent sidebar on `lg` and up, an off-canvas
 * drawer below it, with the navbar above the routed content.
 */
export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  /* Dismiss on Escape, matching the scrim and close button. */
  useEffect(() => {
    if (!isSidebarOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen])

  return (
    <div className="min-h-dvh bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-h-dvh flex-col lg:pl-72">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
