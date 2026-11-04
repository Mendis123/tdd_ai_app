import { createSlice } from '@reduxjs/toolkit'
import { toApiError } from '../../utils/api/apiError.ts'
import type { TasksState } from '../../utils/types/task.ts'
import { sessionCleared } from '../auth/authSlice.ts'
import { signOut } from '../auth/authThunks.ts'
import { createTask, fetchTasks } from './tasksThunks.ts'

const initialState: TasksState = {
  tasks: [],
  listMeta: null,
  listStatus: 'idle',
  listError: null,
  listRequestId: null,
  createStatus: 'idle',
  createError: null,
  createRequestId: null,
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /** Drops the loaded list, e.g. when its screen unmounts, so the next visit never shows stale rows. */
    taskListReset(state) {
      state.tasks = []
      state.listMeta = null
      state.listStatus = 'idle'
      state.listError = null
      state.listRequestId = null
    },
    /** Returns the create flow to idle, e.g. when its screen unmounts. */
    createTaskReset(state) {
      state.createStatus = 'idle'
      state.createError = null
      state.createRequestId = null
    },
  },
  extraReducers: (builder) => {
    builder
      /* The current rows stay in place while the next page loads, so the table does not collapse. */
      .addCase(fetchTasks.pending, (state, action) => {
        state.listStatus = 'pending'
        state.listError = null
        state.listRequestId = action.meta.requestId
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) {
          return
        }

        state.listStatus = 'fulfilled'
        state.tasks = action.payload.data
        state.listMeta = action.payload.meta
        state.listRequestId = null
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) {
          return
        }

        state.listStatus = 'rejected'
        state.listError = action.payload ?? toApiError(action.error)
        state.listRequestId = null
      })
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

export const { taskListReset, createTaskReset } = tasksSlice.actions
