import type { SignInCredentials } from './auth.ts'

/** One message per sign-in field; keyed off the credentials so the two cannot drift apart. */
export type SignInFieldErrors = Partial<Record<keyof SignInCredentials, string>>
