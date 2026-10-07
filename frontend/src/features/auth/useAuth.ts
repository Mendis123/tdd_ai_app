import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts'
import {
  selectAuthStatus,
  selectAuthToken,
  selectCurrentUser,
  selectSignInError,
  selectSignInStatus,
} from './authSelectors.ts'
import { signInErrorCleared } from './authSlice.ts'
import { signIn, signOut } from './authThunks.ts'
import type { AuthState, SignInCredentials } from '../../utils/types/auth.ts'

export type UseAuthValue = AuthState & {
  /** Resolves `true` once the token is stored; a rejection lands in `signInError`. */
  signIn: (credentials: SignInCredentials) => Promise<boolean>
  signOut: () => Promise<void>
  clearSignInError: () => void
}

/** The session as components see it: slice state plus bound thunks. */
export function useAuth(): UseAuthValue {
  const user = useAppSelector(selectCurrentUser)
  const token = useAppSelector(selectAuthToken)
  const status = useAppSelector(selectAuthStatus)
  const signInStatus = useAppSelector(selectSignInStatus)
  const signInError = useAppSelector(selectSignInError)
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

  return {
    user,
    token,
    status,
    signInStatus,
    signInError,
    signIn: handleSignIn,
    signOut: handleSignOut,
    clearSignInError,
  }
}
