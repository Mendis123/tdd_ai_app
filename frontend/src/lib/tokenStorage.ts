const TOKEN_KEY = 'tdd_ai_app.auth_token'

/**
 * Persists the Sanctum plain-text token across reloads.
 *
 * Every access is guarded because `localStorage` throws in private-browsing
 * modes and when site data is blocked; a failure there must never break the app.
 */
export const tokenStorage = {
  read(): string | null {
    try {
      return window.localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  write(token: string): void {
    try {
      window.localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* Session stays in memory only. */
    }
  },

  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* Nothing to clean up. */
    }
  },
}
