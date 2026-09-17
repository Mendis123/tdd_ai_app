import axios from 'axios'

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

type LaravelErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again.'

/**
 * Normalises any thrown value into an {@link ApiError}.
 */
export function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return { message: GENERIC_MESSAGE, fieldErrors: {}, status: null }
  }

  if (!error.response) {
    return {
      message: 'Unable to reach the server. Check your connection and try again.',
      fieldErrors: {},
      status: null,
    }
  }

  const { status } = error.response
  const body = error.response.data as LaravelErrorBody | undefined

  const fieldErrors = Object.fromEntries(
    Object.entries(body?.errors ?? {})
      .map(([field, messages]) => [field, messages[0]] as const)
      .filter(([, message]) => Boolean(message)),
  )

  if (status === 422) {
    return {
      message: body?.message ?? 'Please check the highlighted fields.',
      fieldErrors,
      status,
    }
  }

  if (status === 429) {
    return {
      message: 'Too many attempts. Please wait a moment and try again.',
      fieldErrors,
      status,
    }
  }

  if (status >= 500) {
    return { message: 'The server ran into a problem. Please try again.', fieldErrors, status }
  }

  return { message: body?.message ?? GENERIC_MESSAGE, fieldErrors, status }
}
