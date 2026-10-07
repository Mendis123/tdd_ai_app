import { createAppAsyncThunk } from '../../app/createAppAsyncThunk.ts'
import { toApiError } from '../../utils/api/apiError.ts'
import * as taskApi from '../../utils/api/taskApi.ts'
import type { CreateTaskPayload } from '../../utils/types/task.ts'

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
