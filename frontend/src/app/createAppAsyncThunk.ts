import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ApiError } from '../utils/types/api.ts'
import type { RootState } from './store.ts'

/*
 * Every thunk rejects with an `ApiError` rather than the raw Axios error: the
 * latter is not serializable, and components must never read
 * `error.response.data` themselves.
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  rejectValue: ApiError
}>()
