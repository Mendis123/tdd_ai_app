import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
})

let authToken: string | null = null

/**
 * Sets the bearer token sent with every subsequent request. Kept in a module
 * variable rather than read from storage per request so the header survives
 * environments where `localStorage` is unavailable.
 */
export function setAuthToken(token: string | null): void {
  authToken = token
}

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
})

let unauthorizedHandler: (() => void) | null = null

/**
 * Registers the callback fired when the API rejects the current token, so a
 * revoked or expired token drops the user back to the sign-in screen instead of
 * leaving a signed-in shell that fails every request.
 *
 * @returns An unsubscribe function.
 */
export function onUnauthorized(handler: () => void): () => void {
  unauthorizedHandler = handler

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null
    }
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      unauthorizedHandler?.()
    }

    return Promise.reject(error)
  },
)
