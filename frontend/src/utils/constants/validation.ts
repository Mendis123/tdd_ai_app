import { TASK_TITLE_MAX_LENGTH } from './task.ts'

/**
 * Deliberately loose: it only catches obvious typos before a round trip. The
 * API's own `email` rule stays the authority.
 */
export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export const VALIDATION_MESSAGES = {
  emailRequired: 'Email is required.',
  emailInvalid: 'Enter a valid email address.',
  passwordRequired: 'Password is required.',
  titleRequired: 'Title is required.',
  titleTooLong: `Title must not be longer than ${TASK_TITLE_MAX_LENGTH} characters.`,
} as const
