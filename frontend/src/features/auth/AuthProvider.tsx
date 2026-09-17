import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onUnauthorized, setAuthToken } from '../../lib/apiClient.ts'
import { tokenStorage } from '../../lib/tokenStorage.ts'
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext.ts'
import * as authApi from './authApi.ts'
import type { AuthenticatedUser, SignInCredentials } from './types.ts'

/**
 * Owns the single source of truth for the session: the bearer token (mirrored
 * into storage and the Axios client) and the authenticated user.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /* Read once on mount: the token decides whether we boot into a check at all. */
  const [storedToken] = useState(() => tokenStorage.read())
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>(storedToken ? 'checking' : 'unauthenticated')

  const clearSession = useCallback(() => {
    tokenStorage.clear()
    setAuthToken(null)
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  /* A token the API rejects is no longer a session, wherever it was noticed. */
  useEffect(() => onUnauthorized(clearSession), [clearSession])

  /*
   * Validate any stored token before trusting it: it may have been revoked by a
   * sign-out elsewhere, so the shell must not render against a dead token.
   */
  useEffect(() => {
    if (!storedToken) {
      return
    }

    let isCurrent = true
    setAuthToken(storedToken)

    authApi
      .fetchAuthenticatedUser()
      .then((authenticatedUser) => {
        if (!isCurrent) {
          return
        }

        setUser(authenticatedUser)
        setStatus('authenticated')
      })
      .catch(() => {
        if (isCurrent) {
          clearSession()
        }
      })

    return () => {
      isCurrent = false
    }
  }, [storedToken, clearSession])

  const handleSignIn = useCallback(async (credentials: SignInCredentials) => {
    const { user: authenticatedUser, token } = await authApi.signIn(credentials)

    tokenStorage.write(token)
    setAuthToken(token)
    setUser(authenticatedUser)
    setStatus('authenticated')
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await authApi.signOut()
    } catch {
      /* The local session is dropped either way; a stale token expires server-side. */
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signIn: handleSignIn, signOut: handleSignOut }),
    [user, status, handleSignIn, handleSignOut],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
