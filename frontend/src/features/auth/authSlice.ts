import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store.ts'
import { toApiError } from '../../utils/api/apiError.ts'
import * as authApi from '../../utils/api/authApi.ts'
import type { ApiError } from '../../utils/types/api.ts'
import type { AuthenticatedUser, SignInCredentials } from '../../utils/types/auth.ts'

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
  /** Already normalised by `toApiError()`, so it is serializable and UI-ready. */
  signInError: ApiError | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'checking',
  signInStatus: 'idle',
  signInError: null,
}

/*
 * Every auth thunk rejects with an `ApiError` rather than the raw Axios error:
 * the latter is not serializable, and components must never read
 * `error.response.data` themselves.
 */
const createAuthThunk = createAsyncThunk.withTypes<{ state: RootState; rejectValue: ApiError }>()

/** Exchanges credentials for a token; drives `signInStatus` through pending → fulfilled | rejected. */
export const signIn = createAuthThunk(
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
export const restoreSession = createAuthThunk(
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
export const signOut = createAuthThunk('auth/signOut', async () => {
  try {
    await authApi.signOut()
  } catch {
    /* A stale token is harmless once it is gone from this client. */
  }
})

function clearSession(state: AuthState): void {
  state.user = null
  state.token = null
  state.status = 'unauthenticated'
  state.signInStatus = 'idle'
  state.signInError = null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Fired when the API rejects the current token (401), wherever it was noticed. */
    sessionCleared: clearSession,
    signInErrorCleared(state) {
      state.signInStatus = 'idle'
      state.signInError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.signInStatus = 'pending'
        state.signInError = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.status = 'authenticated'
        state.signInStatus = 'fulfilled'
      })
      .addCase(signIn.rejected, (state, action) => {
        state.signInStatus = 'rejected'
        state.signInError = action.payload ?? toApiError(action.error)
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (!action.payload) {
          clearSession(state)

          return
        }

        state.user = action.payload
        state.status = 'authenticated'
      })
      .addCase(restoreSession.rejected, clearSession)
      .addCase(signOut.fulfilled, clearSession)
  },
})

export const { sessionCleared, signInErrorCleared } = authSlice.actions

export const selectAuth = (state: RootState): AuthState => state.auth
