import type { CreateTaskPayload, TaskFormValues } from '../types/task.ts'

/** Blank optional inputs are sent as `null`, which the API stores as "not set". */
function toNullable(value: string): string | null {
  const trimmed = value.trim()

  return trimmed === '' ? null : trimmed
}

/** Turns the form's string state into the `POST /api/tasks` body. */
export function toCreateTaskPayload(values: TaskFormValues): CreateTaskPayload {
  return {
    title: values.title.trim(),
    description: toNullable(values.description),
    status: values.status,
    priority: values.priority,
    due_date: toNullable(values.due_date),
  }
}
