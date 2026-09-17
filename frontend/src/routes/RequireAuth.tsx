import { Navigate, Outlet, useLocation } from 'react-router'
import { FullPageLoader } from '../components/FullPageLoader.tsx'
import { useAuth } from '../features/auth/useAuth.ts'

/** Gates the signed-in area; remembers the denied path so sign-in can return to it. */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return <FullPageLoader label="Restoring your session" />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
