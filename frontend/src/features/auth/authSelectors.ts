import type { RootState } from '../../app/store.ts'
import type { ApiError } from '../../utils/types/api.ts'
import type { AuthenticatedUser, AuthStatus, SignInStatus } from '../../utils/types/auth.ts'

/*
 * The slice's read API. Each selector returns one field (or a value derived
 * from one), so a component subscribes only to what it renders.
 */

export const selectCurrentUser = (state: RootState): AuthenticatedUser | null => state.auth.user

export const selectAuthToken = (state: RootState): string | null => state.auth.token

export const selectAuthStatus = (state: RootState): AuthStatus => state.auth.status

/** `false` while the persisted token is still being checked, not only once it is rejected. */
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.status === 'authenticated'

export const selectSignInStatus = (state: RootState): SignInStatus => state.auth.signInStatus

export const selectSignInError = (state: RootState): ApiError | null => state.auth.signInError
