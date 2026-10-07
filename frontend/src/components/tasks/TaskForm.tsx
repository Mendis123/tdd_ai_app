import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { Alert } from '../ui/Alert.tsx'
import { Button } from '../ui/Button.tsx'
import { SelectField } from '../ui/SelectField.tsx'
import { TextareaField } from '../ui/TextareaField.tsx'
import { TextField } from '../ui/TextField.tsx'
import {
  TASK_FORM_DEFAULTS,
  TASK_FORM_FIELDS,
  TASK_FORM_TEXT,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '../../utils/constants/task.ts'
import type { ApiError } from '../../utils/types/api.ts'
import type { TaskFieldErrors, TaskFormValues } from '../../utils/types/task.ts'
import { hasFieldErrors } from '../../utils/validation/rules.ts'
import { validateTaskForm } from '../../utils/validation/validateTaskForm.ts'

type TaskField = keyof TaskFormValues

type TaskFormProps = {
  initialValues?: TaskFormValues
  submitLabel: string
  submittingLabel: string
  isSubmitting: boolean
  /** The last failed submission: 422 messages are shown on their fields, anything else as an alert. */
  serverError: ApiError | null
  /** Called with values that have passed client-side validation. */
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
}

/** The server's messages for the fields this form renders. */
function toServerFieldErrors(serverError: ApiError | null): TaskFieldErrors {
  if (!serverError) {
    return {}
  }

  return Object.fromEntries(
    TASK_FORM_FIELDS.filter((field) => serverError.fieldErrors[field]).map((field) => [
      field,
      serverError.fieldErrors[field],
    ]),
  )
}

/**
 * Task fields, validation and error display, independent of whether a task is
 * being created or edited: the screen owns the request and what follows it.
 */
export function TaskForm({
  initialValues = TASK_FORM_DEFAULTS,
  submitLabel,
  submittingLabel,
  isSubmitting,
  serverError,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues)
  const [clientFieldErrors, setClientFieldErrors] = useState<TaskFieldErrors>({})
  const controlRefs = useRef<Partial<Record<TaskField, HTMLElement | null>>>({})

  const serverFieldErrors = toServerFieldErrors(serverError)
  const fieldErrors: TaskFieldErrors = { ...serverFieldErrors, ...clientFieldErrors }
  const isFormLevelError = serverError !== null && !hasFieldErrors(serverFieldErrors)

  /* Take the user to what needs fixing once the API has answered. */
  useEffect(() => {
    if (!serverError) {
      return
    }

    const firstInvalidField = TASK_FORM_FIELDS.find((field) => serverError.fieldErrors[field]) ?? 'title'
    controlRefs.current[firstInvalidField]?.focus()
  }, [serverError])

  function updateField<TField extends TaskField>(field: TField, value: TaskFormValues[TField]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateTaskForm(values)
    setClientFieldErrors(errors)

    if (hasFieldErrors(errors)) {
      const firstInvalidField = TASK_FORM_FIELDS.find((field) => errors[field])

      if (firstInvalidField) {
        controlRefs.current[firstInvalidField]?.focus()
      }

      return
    }

    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5 p-5 sm:p-6">
        {isFormLevelError ? <Alert>{serverError.message}</Alert> : null}

        <TextField
          ref={(element) => {
            controlRefs.current.title = element
          }}
          label={TASK_FORM_TEXT.titleLabel}
          name="title"
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
          error={fieldErrors.title}
          placeholder={TASK_FORM_TEXT.titlePlaceholder}
          autoComplete="off"
          autoFocus
          required
        />

        <TextareaField
          ref={(element) => {
            controlRefs.current.description = element
          }}
          label={TASK_FORM_TEXT.descriptionLabel}
          hint={TASK_FORM_TEXT.optional}
          name="description"
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          error={fieldErrors.description}
          placeholder={TASK_FORM_TEXT.descriptionPlaceholder}
          rows={4}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            ref={(element) => {
              controlRefs.current.status = element
            }}
            label={TASK_FORM_TEXT.statusLabel}
            name="status"
            options={TASK_STATUS_OPTIONS}
            value={values.status}
            onChange={(status) => updateField('status', status)}
            error={fieldErrors.status}
          />

          <SelectField
            ref={(element) => {
              controlRefs.current.priority = element
            }}
            label={TASK_FORM_TEXT.priorityLabel}
            name="priority"
            options={TASK_PRIORITY_OPTIONS}
            value={values.priority}
            onChange={(priority) => updateField('priority', priority)}
            error={fieldErrors.priority}
          />

          <TextField
            ref={(element) => {
              controlRefs.current.due_date = element
            }}
            label={TASK_FORM_TEXT.dueDateLabel}
            hint={TASK_FORM_TEXT.optional}
            type="date"
            name="due_date"
            value={values.due_date}
            onChange={(event) => updateField('due_date', event.target.value)}
            error={fieldErrors.due_date}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {TASK_FORM_TEXT.cancel}
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
