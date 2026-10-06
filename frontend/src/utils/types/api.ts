/**
 * A transport- and framework-agnostic view of a failed request, so components
 * never have to know about Axios or Laravel's response envelope.
 */
export type ApiError = {
  /** Message safe to show the user. */
  message: string
  /** Laravel validation errors flattened to one message per field. */
  fieldErrors: Record<string, string>
  status: number | null
}

/** Laravel's error envelope, as returned for validation and HTTP exceptions. */
export type LaravelErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}
