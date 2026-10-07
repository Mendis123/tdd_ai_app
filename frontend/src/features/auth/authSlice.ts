import { createSlice } from '@reduxjs/toolkit'
import { toApiError } from '../../utils/api/apiError.ts'
import type { AuthState } from '../../utils/types/auth.ts'
import { restoreSession, signIn, signOut } from './authThunks.ts'

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'checking',
  signInStatus: 'idle',
  signInError: null,
}

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
