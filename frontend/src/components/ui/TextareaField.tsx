import type { Ref, TextareaHTMLAttributes } from 'react'
import { FormField } from './FormField.tsx'
import { fieldControlClassName } from './fieldStyles.ts'

type TextareaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string
  /** Secondary text beside the label, such as "Optional". */
  hint?: string
  /** Validation message; its presence also switches the field to its error state. */
  error?: string
  /** Exposed so a form can move focus to the first field that failed validation. */
  ref?: Ref<HTMLTextAreaElement>
}

export function TextareaField({ label, hint, error, className = '', ...props }: TextareaFieldProps) {
  return (
    <FormField label={label} hint={hint} error={error}>
      {(controlProps) => (
        <textarea
          {...controlProps}
          className={`${fieldControlClassName(Boolean(error))} min-h-28 resize-y px-3.5 py-2.5 leading-6 ${className}`}
          {...props}
        />
      )}
    </FormField>
  )
}
