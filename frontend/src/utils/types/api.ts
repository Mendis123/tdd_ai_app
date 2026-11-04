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

/** A single Laravel `JsonResource`, which wraps its payload in `data`. */
export type ApiResource<T> = {
  data: T
}

/** The `meta` block Laravel sends with a paginated resource collection. */
export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  /** 1-based position of the first item on this page; `null` when the page is empty. */
  from: number | null
  /** 1-based position of the last item on this page; `null` when the page is empty. */
  to: number | null
}

/**
 * A paginated Laravel resource collection. Its `links` block is not kept: the
 * UI asks for pages by number.
 */
export type PaginatedResource<T> = {
  data: T[]
  meta: PaginationMeta
}

/** Lifecycle of a single request tracked in a slice. */
export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected'

/** Laravel's error envelope, as returned for validation and HTTP exceptions. */
export type LaravelErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}
