import { TASK_TITLE_MAX_LENGTH } from '../constants/task.ts'
import { VALIDATION_MESSAGES } from '../constants/validation.ts'
import type { TaskFieldErrors, TaskFormValues } from '../types/task.ts'
import { characterCount, isBlank } from './rules.ts'

/**
 * Mirrors the `title` rules in `StoreTaskRequest` so an obviously invalid form
 * never costs a round trip. Status and priority come from fixed options and the
 * date from a native picker, so the API (whose 422 always wins) covers those.
 */
export function validateTaskForm({ title }: TaskFormValues): TaskFieldErrors {
  const errors: TaskFieldErrors = {}

  if (isBlank(title)) {
    errors.title = VALIDATION_MESSAGES.titleRequired
  } else if (characterCount(title.trim()) > TASK_TITLE_MAX_LENGTH) {
    errors.title = VALIDATION_MESSAGES.titleTooLong
  }

  return errors
}
