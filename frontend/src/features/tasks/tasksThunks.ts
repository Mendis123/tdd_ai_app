import { createAppAsyncThunk } from '../../app/createAppAsyncThunk.ts'
import { toApiError } from '../../utils/api/apiError.ts'
import * as taskApi from '../../utils/api/taskApi.ts'
import type { CreateTaskPayload } from '../../utils/types/task.ts'

/** Loads one page of the signed-in user's tasks; drives `listStatus` through pending → fulfilled | rejected. */
export const fetchTasks = createAppAsyncThunk(
  'tasks/fetchTasks',
  async (page: number, { rejectWithValue }) => {
    try {
      return await taskApi.fetchTasks(page)
    } catch (error) {
      return rejectWithValue(toApiError(error))
    }
  },
)

/** Creates a task for the signed-in user; drives `createStatus` through pending → fulfilled | rejected. */
export const createTask = createAppAsyncThunk(
  'tasks/createTask',
  async (payload: CreateTaskPayload, { rejectWithValue }) => {
    try {
      return await taskApi.createTask(payload)
    } catch (error) {
      return rejectWithValue(toApiError(error))
    }
  },
)
