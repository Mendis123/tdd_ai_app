import type { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../constants/task.ts'
import type { ApiError, PaginationMeta, RequestStatus } from './api.ts'

export type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number]['value']

export type TaskPriority = (typeof TASK_PRIORITY_OPTIONS)[number]['value']

/** Shape returned by `TaskResource` on the API. */
export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  /** `YYYY-MM-DD`. */
  due_date: string | null
  created_at: string
  updated_at: string
}

/**
 * Body of `POST /api/tasks`. Ownership is never sent: the API attaches the
 * task to the authenticated user.
 */
export type CreateTaskPayload = {
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
}

/**
 * The task form's state, each field held as its control's value. Keys match
 * the API's so a 422 `errors` bag maps straight onto the fields.
 */
export type TaskFormValues = {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
}

/** One message per task form field. */
export type TaskFieldErrors = Partial<Record<keyof TaskFormValues, string>>

export type TasksState = {
  /** The page of tasks the list screen is showing. */
  tasks: Task[]
  /** Pagination for `tasks`; `null` until the first page has loaded. */
  listMeta: PaginationMeta | null
  listStatus: RequestStatus
  listError: ApiError | null
  /** The in-flight fetch, so a slower response for a page the user has left is ignored. */
  listRequestId: string | null
  createStatus: RequestStatus
  /** Already normalized by `toApiError()`, so it is serializable and UI-ready. */
  createError: ApiError | null
  /** The in-flight create, so a response that lands after a reset is ignored. */
  createRequestId: string | null
}
