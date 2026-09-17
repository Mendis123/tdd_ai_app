import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  /** Validation message; its presence also switches the field to its error state. */
  error?: string
  /** Rendered inside the field on the trailing edge (for example, a reveal toggle). */
  trailing?: ReactNode
  /** Exposed so a form can move focus to the first field that failed validation. */
  ref?: Ref<HTMLInputElement>
}

export function TextField({ label, error, trailing, className = '', ...props }: TextFieldProps) {
  const inputId = useId()
  const errorId = `${inputId}-error`

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`block h-11 w-full rounded-lg bg-white px-3.5 text-sm text-slate-900 shadow-xs ring-1 ring-inset transition placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
            error
              ? 'ring-red-400 focus:ring-red-500'
              : 'ring-slate-300 hover:ring-slate-400 focus:ring-brand-600'
          } ${trailing ? 'pr-11' : ''} ${className}`}
          {...props}
        />

        {trailing ? (
          <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">{trailing}</span>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
