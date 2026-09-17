import { Navigate, Outlet } from 'react-router'
import { FullPageLoader } from '../components/FullPageLoader.tsx'
import { useAuth } from '../features/auth/useAuth.ts'

/** Keeps an already signed-in user off the sign-in screen. */
export function RedirectIfAuthenticated() {
  const { status } = useAuth()

  if (status === 'checking') {
    return <FullPageLoader label="Restoring your session" />
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
