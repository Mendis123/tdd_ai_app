import { apiClient } from './apiClient.ts'
import type { ApiResource, PaginatedResource } from '../types/api.ts'
import type { CreateTaskPayload, Task } from '../types/task.ts'

/** One page of the authenticated user's tasks, newest first. */
export async function fetchTasks(page: number): Promise<PaginatedResource<Task>> {
  const { data } = await apiClient.get<PaginatedResource<Task>>('/tasks', { params: { page } })

  return { data: data.data, meta: data.meta }
}

/** Creates a task owned by the authenticated user; a 422 carries per-field `errors`. */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await apiClient.post<ApiResource<Task>>('/tasks', payload)

  return data.data
}
