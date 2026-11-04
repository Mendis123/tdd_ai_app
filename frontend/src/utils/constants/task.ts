import type { TaskFormValues } from '../types/task.ts'

/**
 * Mirrors the API's `TaskStatus` enum. The `TaskStatus` type is derived from
 * this list, so a value added here is immediately selectable and type-checked.
 */
export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
] as const

/** Mirrors the API's `TaskPriority` enum; see {@link TASK_STATUS_OPTIONS}. */
export const TASK_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const

/** Matches the `max:255` rule on `title` in `StoreTaskRequest`. */
export const TASK_TITLE_MAX_LENGTH = 255

/** Form fields in on-screen order, so focus can move to the first invalid one. */
export const TASK_FORM_FIELDS = [
  'title',
  'description',
  'status',
  'priority',
  'due_date',
] as const satisfies ReadonlyArray<keyof TaskFormValues>

/** A blank form; `status` and `priority` match the API's own defaults. */
export const TASK_FORM_DEFAULTS: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
}

/** Field copy shared by every screen that renders the task form. */
export const TASK_FORM_TEXT = {
  titleLabel: 'Title',
  titlePlaceholder: 'e.g. Draft the project plan',
  descriptionLabel: 'Description',
  descriptionPlaceholder: 'Add notes, links, or next steps',
  statusLabel: 'Status',
  priorityLabel: 'Priority',
  dueDateLabel: 'Due date',
  optional: 'Optional',
  cancel: 'Cancel',
} as const

/** Task list column headings, in on-screen order. */
export const TASK_TABLE_COLUMNS = [
  'Title',
  'Description',
  'Status',
  'Priority',
  'Due date',
  'Actions',
] as const

/** Copy for the task list screen. */
export const TASK_LIST_TEXT = {
  heading: 'Tasks',
  subheading: 'Everything on your list, newest first.',
  createTask: 'Create task',
  tableCaption: 'Your tasks',
  loading: 'Loading tasks',
  retry: 'Try again',
  emptyHeading: 'No tasks yet',
  emptyBody: 'Create your first task to start tracking your work.',
  /** Shown in place of an unset description or due date. */
  noValue: '—',
  edit: 'Edit',
  delete: 'Delete',
  editLabel: (title: string) => `Edit “${title}”`,
  deleteLabel: (title: string) => `Delete “${title}”`,
} as const

/** Copy for the create-task screen. */
export const TASK_CREATE_TEXT = {
  heading: 'Create task',
  subheading: 'Add a task with as much or as little detail as you need.',
  submit: 'Create task',
  submitting: 'Creating…',
  created: (title: string) => `“${title}” was created. Add another below.`,
} as const
