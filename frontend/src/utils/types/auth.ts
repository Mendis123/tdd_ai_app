import type { ApiError } from './api.ts'

/** Shape returned by `UserResource` on the API. */
export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  created_at: string
}

export type SignInCredentials = {
  email: string
  password: string
}

/** `POST /api/login` deliberately returns `user` unwrapped, alongside the token. */
export type SignInResponse = {
  user: AuthenticatedUser
  token: string
}

/**
 * `checking` covers the boot-time round trip that validates a persisted token,
 * so routes can hold their decision instead of flashing the sign-in screen.
 */
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

/** Lifecycle of the most recent `POST /api/login` request. */
export type SignInStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type AuthState = {
  user: AuthenticatedUser | null
  token: string | null
  status: AuthStatus
  signInStatus: SignInStatus
  /** Already normalized by `toApiError()`, so it is serializable and UI-ready. */
  signInError: ApiError | null
}
