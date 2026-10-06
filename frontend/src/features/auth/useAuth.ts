import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts'
import {
  selectAuth,
  signIn,
  signInErrorCleared,
  signOut,
  type AuthState,
} from './authSlice.ts'
import type { SignInCredentials } from '../../utils/types/auth.ts'

export type UseAuthValue = AuthState & {
  /** Resolves `true` once the token is stored; a rejection lands in `signInError`. */
  signIn: (credentials: SignInCredentials) => Promise<boolean>
  signOut: () => Promise<void>
  clearSignInError: () => void
}

/** The session as components see it: slice state plus bound thunks. */
export function useAuth(): UseAuthValue {
  const auth = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  const handleSignIn = useCallback(
    async (credentials: SignInCredentials) => {
      const result = await dispatch(signIn(credentials))

      return signIn.fulfilled.match(result)
    },
    [dispatch],
  )

  const handleSignOut = useCallback(async () => {
    await dispatch(signOut())
  }, [dispatch])

  const clearSignInError = useCallback(() => {
    dispatch(signInErrorCleared())
  }, [dispatch])

  return { ...auth, signIn: handleSignIn, signOut: handleSignOut, clearSignInError }
}
