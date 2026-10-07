import { createAppAsyncThunk } from '../../app/createAppAsyncThunk.ts'
import { toApiError } from '../../utils/api/apiError.ts'
import * as authApi from '../../utils/api/authApi.ts'
import type { SignInCredentials } from '../../utils/types/auth.ts'

/** Exchanges credentials for a token; drives `signInStatus` through pending → fulfilled | rejected. */
export const signIn = createAppAsyncThunk(
  'auth/signIn',
  async (credentials: SignInCredentials, { rejectWithValue }) => {
    try {
      return await authApi.signIn(credentials)
    } catch (error) {
      return rejectWithValue(toApiError(error))
    }
  },
)

/**
 * Revalidates the persisted token with `GET /api/user` once the store has
 * rehydrated: it may have been revoked by a sign-out elsewhere, so the shell
 * must not render against a dead token. Resolves `null` when there is none.
 */
export const restoreSession = createAppAsyncThunk(
  'auth/restoreSession',
  async (_: void, { getState, rejectWithValue }) => {
    if (!getState().auth.token) {
      return null
    }

    try {
      return await authApi.fetchAuthenticatedUser()
    } catch (error) {
      return rejectWithValue(toApiError(error))
    }
  },
)

/** Revokes the token server-side; the local session is dropped even if that fails. */
export const signOut = createAppAsyncThunk('auth/signOut', async () => {
  try {
    await authApi.signOut()
  } catch {
    /* A stale token is harmless once it is gone from this client. */
  }
})
