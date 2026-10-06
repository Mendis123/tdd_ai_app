import { EMAIL_PATTERN } from '../constants/validation.ts'

/** True for an empty or whitespace-only value. */
export function isBlank(value: string): boolean {
  return value.trim() === ''
}

/** True when the trimmed value looks like an email address. */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/** True when at least one field carries a message. */
export function hasFieldErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean)
}
