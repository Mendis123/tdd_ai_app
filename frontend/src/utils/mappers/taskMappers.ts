import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../constants/task.ts'
import type { CreateTaskPayload, TaskFormValues, TaskPriority, TaskStatus } from '../types/task.ts'

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

/** The label shown for a status, from the same options the form offers. */
export function toTaskStatusLabel(status: TaskStatus): string {
  return TASK_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status
}

/** The label shown for a priority, from the same options the form offers. */
export function toTaskPriorityLabel(priority: TaskPriority): string {
  return TASK_PRIORITY_OPTIONS.find((option) => option.value === priority)?.label ?? priority
}

const DUE_DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

/**
 * Formats the API's `YYYY-MM-DD` in the user's locale. The parts are read as a
 * local date: `new Date('2026-12-01')` would be UTC midnight and show the
 * previous day west of Greenwich.
 */
export function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split('-').map(Number)

  return DUE_DATE_FORMAT.format(new Date(year, month - 1, day))
}
