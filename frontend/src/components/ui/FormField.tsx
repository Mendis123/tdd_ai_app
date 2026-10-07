import { useId, type ReactNode } from 'react'

/** Accessibility wiring a control must spread so its label and error describe it. */
export type FormControlProps = {
  id: string
  'aria-invalid': true | undefined
  'aria-describedby': string | undefined
}

export type FormFieldProps = {
  label: string
  /** Secondary text beside the label, such as "Optional". */
  hint?: string
  /** Validation message; its presence also switches the control to its error state. */
  error?: string
  children: (controlProps: FormControlProps) => ReactNode
}

/** Label, control and error message for any single form control. */
export function FormField({ label, hint, error, children }: FormFieldProps) {
  const controlId = useId()
  const errorId = `${controlId}-error`

  return (
    <div>
      <label
        htmlFor={controlId}
        className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-slate-700"
      >
        {label}
        {hint ? <span className="text-xs font-normal text-slate-500">{hint}</span> : null}
      </label>

      {children({
        id: controlId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
