import type { RootState } from '../../app/store.ts'
import type { ApiError, RequestStatus } from '../../utils/types/api.ts'

/*
 * The slice's read API. Each selector returns one field, so a component
 * subscribes only to what it renders.
 */

export const selectCreateTaskStatus = (state: RootState): RequestStatus => state.tasks.createStatus

export const selectCreateTaskError = (state: RootState): ApiError | null => state.tasks.createError
