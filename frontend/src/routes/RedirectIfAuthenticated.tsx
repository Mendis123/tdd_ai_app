import { Navigate, Outlet, useLocation } from 'react-router'
import { FullPageLoader } from '../components/FullPageLoader.tsx'
import { useAuth } from '../features/auth/useAuth.ts'

/**
 * Keeps an already signed-in user off the sign-in screen, and is also what
 * completes a sign-in: it returns the user to whatever `RequireAuth` denied,
 * defaulting to the dashboard.
 */
export function RedirectIfAuthenticated() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return <FullPageLoader label="Restoring your session" />
  }

  if (status === 'authenticated') {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
