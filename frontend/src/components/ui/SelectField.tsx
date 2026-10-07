import type { Ref, SelectHTMLAttributes } from 'react'
import { ChevronDownIcon } from '../../assets/svg/index.ts'
import { FormField } from './FormField.tsx'
import { fieldControlClassName } from './fieldStyles.ts'

export type SelectOption<TValue extends string> = {
  value: TValue
  label: string
}

type SelectFieldProps<TValue extends string> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'value' | 'onChange' | 'children'
> & {
  label: string
  /** Secondary text beside the label, such as "Optional". */
  hint?: string
  /** Validation message; its presence also switches the field to its error state. */
  error?: string
  options: ReadonlyArray<SelectOption<TValue>>
  value: TValue
  /** Receives the chosen option's value, already narrowed to `TValue`. */
  onChange: (value: TValue) => void
  /** Exposed so a form can move focus to the first field that failed validation. */
  ref?: Ref<HTMLSelectElement>
}

/**
 * A native `<select>` styled to match the text fields, so keyboard, screen
 * reader and mobile pickers all behave as the platform expects.
 */
export function SelectField<TValue extends string>({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  className = '',
  ...props
}: SelectFieldProps<TValue>) {
  return (
    <FormField label={label} hint={hint} error={error}>
      {(controlProps) => (
        <div className="relative">
          <select
            {...controlProps}
            value={value}
            /* Safe: the only values the element can hold are the options rendered below. */
            onChange={(event) => onChange(event.target.value as TValue)}
            className={`${fieldControlClassName(Boolean(error))} h-11 appearance-none pr-10 pl-3.5 ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-400" />
        </div>
      )}
    </FormField>
  )
}
