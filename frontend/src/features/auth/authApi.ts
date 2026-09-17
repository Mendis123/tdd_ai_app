import { apiClient } from '../../lib/apiClient.ts'
import type { AuthenticatedUser, SignInCredentials, SignInResponse } from './types.ts'

/**
 * Exchanges credentials for a Sanctum personal access token.
 *
 * Rejects with a 422 whose `errors.email` holds a deliberately generic
 * "credentials do not match" message for both an unknown email and a wrong
 * password, so the UI must not imply which one was wrong.
 */
export async function signIn(credentials: SignInCredentials): Promise<SignInResponse> {
  const { data } = await apiClient.post<SignInResponse>('/login', credentials)

  return data
}

/** `GET /api/user` returns a bare `UserResource`, so the payload is `data`-wrapped. */
export async function fetchAuthenticatedUser(): Promise<AuthenticatedUser> {
  const { data } = await apiClient.get<{ data: AuthenticatedUser }>('/user')

  return data.data
}

/** Revokes the token currently on the request. */
export async function signOut(): Promise<void> {
  await apiClient.post('/logout')
}
