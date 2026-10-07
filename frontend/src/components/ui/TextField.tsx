import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { FormField } from './FormField.tsx'
import { fieldControlClassName } from './fieldStyles.ts'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  /** Secondary text beside the label, such as "Optional". */
  hint?: string
  /** Validation message; its presence also switches the field to its error state. */
  error?: string
  /** Rendered inside the field on the trailing edge (for example, a reveal toggle). */
  trailing?: ReactNode
  /** Exposed so a form can move focus to the first field that failed validation. */
  ref?: Ref<HTMLInputElement>
}

export function TextField({ label, hint, error, trailing, className = '', ...props }: TextFieldProps) {
  return (
    <FormField label={label} hint={hint} error={error}>
      {(controlProps) => (
        <div className="relative">
          <input
            {...controlProps}
            className={`${fieldControlClassName(Boolean(error))} h-11 px-3.5 ${trailing ? 'pr-11' : ''} ${className}`}
            {...props}
          />

          {trailing ? (
            <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">{trailing}</span>
          ) : null}
        </div>
      )}
    </FormField>
  )
}
