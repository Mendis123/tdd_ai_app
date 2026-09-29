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
- **The Redux auth slice (`src/features/auth/authSlice.ts`) is the only owner of session state.** There is no
  auth Context. Sign-in, boot revalidation and sign-out are `createAsyncThunk`s (`signIn`, `restoreSession`,
  `signOut`); `signIn` drives `signInStatus` through `pending` → `fulfilled` | `rejected`. Thunks reject via
  `rejectWithValue(toApiError(error))`, so `signInError` is already an `ApiError` — never put a raw Axios error in
  the store (it is not serializable). Components read the session through `useAuth()`, which wraps the typed
  `useAppSelector` / `useAppDispatch` from `src/app/hooks.ts`.
- **Persistence is redux-persist, `user` and `token` only** (`whitelist` in `src/app/store.ts`, storage key
  `tdd_ai_app:auth`). `status` always boots as `checking` and request state boots idle, so a stale pending/error is
  never rehydrated. The `persistStore` callback dispatches `restoreSession` (`GET /api/user`), holding routes in
  `checking` until the persisted token is proven live. Sign-out clears locally even if `POST /api/logout` fails.
- **Import storage from `redux-persist/es/storage`, not `redux-persist/lib/storage`.** The `lib` entry is CommonJS;
  Vite's dev pre-bundling hands back the module wrapper, so `storage.getItem is not a function` at boot and the app
  never renders. `tsc` and `vite build` both pass with the broken import — only running the dev server shows it.
- **Reducers stay pure; the token reaches Axios through a listener.** A `listenerMiddleware` predicate fires
  whenever `state.auth.token` changes (sign-in, rehydration, sign-out, 401) and calls `setAuthToken()`. Do not call
  `setAuthToken()` from thunks or components. The 401 handler (`onUnauthorized`) dispatches `sessionCleared`.
- **Route protection is structural**: `RequireAuth` / `RedirectIfAuthenticated` wrap route subtrees in
  `src/App.tsx` rather than each page checking for itself. `RedirectIfAuthenticated` also *completes* a sign-in by
  navigating to `location.state.from` (set by `RequireAuth`). `SignInPage` must not call `navigate()` itself:
  react-redux store updates re-render synchronously, so the guard redirects before an awaited `navigate()` runs.
