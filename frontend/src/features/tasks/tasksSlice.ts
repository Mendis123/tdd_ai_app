import { createSlice } from '@reduxjs/toolkit'
import { toApiError } from '../../utils/api/apiError.ts'
import type { TasksState } from '../../utils/types/task.ts'
import { sessionCleared } from '../auth/authSlice.ts'
import { signOut } from '../auth/authThunks.ts'
import { createTask } from './tasksThunks.ts'

const initialState: TasksState = {
  createStatus: 'idle',
  createError: null,
  createRequestId: null,
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /** Returns the create flow to idle, e.g. when its screen unmounts. */
    createTaskReset(state) {
      state.createStatus = 'idle'
      state.createError = null
      state.createRequestId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state, action) => {
        state.createStatus = 'pending'
        state.createError = null
        state.createRequestId = action.meta.requestId
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (state.createRequestId !== action.meta.requestId) {
          return
        }

        state.createStatus = 'fulfilled'
        state.createRequestId = null
      })
      .addCase(createTask.rejected, (state, action) => {
        if (state.createRequestId !== action.meta.requestId) {
          return
        }

        state.createStatus = 'rejected'
        state.createError = action.payload ?? toApiError(action.error)
        state.createRequestId = null
      })
      /* Task state belongs to whoever was signed in; never carry it over to the next user. */
      .addCase(sessionCleared, () => initialState)
      .addCase(signOut.fulfilled, () => initialState)
  },
})

export const { createTaskReset } = tasksSlice.actions
