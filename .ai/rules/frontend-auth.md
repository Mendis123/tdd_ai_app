# Frontend Auth & API Access

The SPA in `frontend/` is a standalone Vite/React app that talks to the Laravel API over bearer tokens. It is
**not** served by Laravel and does **not** use Sanctum's cookie/SPA mode — there is no `/sanctum/csrf-cookie`
call, no `withCredentials`, and no stateful domain configuration. Keep it that way: the API's session guard is
deliberately left unauthenticated (see [auth-signin.md](auth-signin.md)), so cookie auth would fight it.

- **One Axios instance, `src/lib/apiClient.ts`.** Never call `axios` directly from a component or feature module.
  The token lives in a module variable set through `setAuthToken()`; a request interceptor attaches
  `Authorization: Bearer …`. `onUnauthorized()` registers the single handler that clears the session when the API
  returns 401, so a revoked token drops to `/signin` from wherever it was noticed.
- **CORS needs no configuration.** The framework default (`paths: ['api/*']`, `allowed_origins: ['*']`,
  `supports_credentials: false`) already covers bearer-token requests from the Vite dev origin. Do not publish a
  `config/cors.php` to "fix" a failing request without first confirming CORS is actually the cause.
- **Base URL comes from `VITE_API_BASE_URL`** (see `frontend/.env.example`) and *includes* the `/api` prefix, so
  call sites read `apiClient.post('/login', …)`. There is no Vite dev proxy.
- **Errors are normalised once, in `src/lib/apiError.ts`.** Components consume `{message, fieldErrors, status}`
  and never touch `error.response.data`. Laravel's `errors` bag is flattened to one message per field.
- **A rejected sign-in is shown as a form-level alert, not an email field error.** The API reports it as a 422 on
  `email` with a message that deliberately does not reveal whether the email or the password was wrong. Rendering
  it under the email input would imply the email was at fault and partially undo the enumeration defence. The
  branch is explicit in `SignInPage`; do not "simplify" it into generic field-error mapping.
- **`AuthProvider` is the only owner of session state.** It mirrors the token into `localStorage` (every access
  wrapped in try/catch — storage throws in private-browsing modes) and revalidates a stored token with
  `GET /api/user` on boot, holding routes in the `checking` status meanwhile. Sign-out clears locally even if
  `POST /api/logout` fails.
- **Route protection is structural**: `RequireAuth` / `RedirectIfAuthenticated` wrap route subtrees in
  `src/App.tsx` rather than each page checking for itself.
- Context, hook, and provider live in separate files (`AuthContext.ts`, `useAuth.ts`, `AuthProvider.tsx`) because
  `eslint-plugin-react-refresh` requires component files to export only components.
