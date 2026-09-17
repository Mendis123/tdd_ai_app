import { createContext } from 'react'
import type { AuthenticatedUser, SignInCredentials } from './types.ts'

/**
 * `checking` covers the boot-time round trip that validates a stored token, so
 * routes can hold their decision instead of flashing the sign-in screen.
 */
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  user: AuthenticatedUser | null
  status: AuthStatus
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
