import type { RootState } from '../../app/store.ts'
import type { ApiError, PaginationMeta, RequestStatus } from '../../utils/types/api.ts'
import type { Task } from '../../utils/types/task.ts'

/*
 * The slice's read API. Each selector returns one field, so a component
 * subscribes only to what it renders.
 */

export const selectTasks = (state: RootState): Task[] => state.tasks.tasks

export const selectTaskListMeta = (state: RootState): PaginationMeta | null => state.tasks.listMeta

export const selectTaskListStatus = (state: RootState): RequestStatus => state.tasks.listStatus

export const selectTaskListError = (state: RootState): ApiError | null => state.tasks.listError

export const selectCreateTaskStatus = (state: RootState): RequestStatus => state.tasks.createStatus

export const selectCreateTaskError = (state: RootState): ApiError | null => state.tasks.createError
