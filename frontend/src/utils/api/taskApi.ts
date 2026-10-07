import { apiClient } from './apiClient.ts'
import type { ApiResource } from '../types/api.ts'
import type { CreateTaskPayload, Task } from '../types/task.ts'

/** Creates a task owned by the authenticated user; a 422 carries per-field `errors`. */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await apiClient.post<ApiResource<Task>>('/tasks', payload)

  return data.data
}
