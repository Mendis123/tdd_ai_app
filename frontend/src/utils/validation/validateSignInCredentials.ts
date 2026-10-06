import { VALIDATION_MESSAGES } from '../constants/validation.ts'
import type { SignInCredentials } from '../types/auth.ts'
import type { SignInFieldErrors } from '../types/signIn.ts'
import { isBlank, isValidEmail } from './rules.ts'

/**
 * Mirrors the API's own rules so an obviously incomplete form never costs a
 * round trip. The server stays the authority: its 422 wins over anything here.
 *
 * The password is checked for emptiness only, never trimmed: leading or
 * trailing spaces may be part of it.
 */
export function validateSignInCredentials({ email, password }: SignInCredentials): SignInFieldErrors {
  const errors: SignInFieldErrors = {}

  if (isBlank(email)) {
    errors.email = VALIDATION_MESSAGES.emailRequired
  } else if (!isValidEmail(email)) {
    errors.email = VALIDATION_MESSAGES.emailInvalid
  }

  if (!password) {
    errors.password = VALIDATION_MESSAGES.passwordRequired
  }

  return errors
}
