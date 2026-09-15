# Sign-In & Token Issuance

- **Never use `Auth::attempt()` or `Auth::once()` in this API.** Sign-in uses `Auth::validate()` followed by
  `Auth::getLastAttempted()` (see `app/Http/Controllers/Auth/LoginController.php`). Both rejected alternatives set a
  user on the session guard: `attempt()` calls `login()` (session write + id regeneration), and `once()` calls
  `setUser()`. Because `config/sanctum.php` sets `'guard' => ['web']`, Sanctum consults the session guard *before* the
  bearer token — so a user left there makes `auth:sanctum` hand back a `TransientToken`, and
  `currentAccessToken()->delete()` in `AuthController::logout()` dies with "undefined method
  TransientToken::delete()". This was observed, not theorised; it is pinned by the test
  *"leaves the session guard unauthenticated so sanctum still resolves bearer tokens"*.
- **Constant-time failures come free from `Auth::validate()`.** `SessionGuard::validate()` wraps the lookup and hash
  in `Timebox::call(..., 200000)` and calls `returnEarly()` only on success, so an unknown email and a wrong password
  both take ~200 ms while success is unpadded. Do **not** replace it with a hand-rolled `Hash::check`, which returns
  early on an unknown email and leaks user existence by timing. Pinned deterministically via `Sleep::fake()` in
  `LoginControllerTest`'s "constant-time failures" block — never assert wall-clock time, it flakes.
  Do not set `auth.timebox_duration => 0` in `phpunit.xml` to speed the suite up; that disables the mitigation in the
  only place it is tested.
- **Pass credentials explicitly: `$request->safe()->only(['email', 'password'])`.** `retrieveByCredentials()` strips
  only `*password*` keys and turns every other key into a `where` clause, so handing it `->validated()` silently
  breaks sign-in the day `LoginRequest` gains a field such as `device_name`.
- **Both failure branches must return the identical body**: `ValidationException::withMessages(['email' =>
  [__('auth.failed')]])` → 422. Never differentiate "no such email" from "wrong password", and never add
  `exists:users,email` to `LoginRequest` — either hands out a user-enumeration oracle. Enumeration parity is a tested
  contract, not a convention.
- **`User::issueApiToken()` is the only place tokens are minted.** `LoginController` and `AuthController::register()`
  both call it; `grep -rn "createToken(" app/` must return exactly one hit. Token expiry, abilities, and any rotation
  policy belong in that method's signature so every sign-in path inherits them at once.
- **Response contract for `POST /api/login`**: `{user: {id, name, email, created_at}, token}` at 200 — `user` is
  deliberately *not* `data`-wrapped, unlike `GET /api/user` which returns a bare `UserResource`. Locked by exact
  `array_keys()` assertions; don't "normalise" the asymmetry.
- **Controller shape**: new auth endpoints get their own single-action `__invoke` controller (registered as
  `Route::post('/login', LoginController::class)`). `AuthController` still holds `register`/`logout`/`me` and is being
  decomposed, not extended — do not add methods to it. There is deliberately **no** `app/Actions` layer: the only
  duplication that existed was token minting, and that lives on the model. Introduce `app/Actions/Auth/` (needs
  approval for the new base folder) when either a second caller needs the same verify-password→issue-token pair
  (realistically a 2FA challenge endpoint) or `__invoke` grows past ~15 lines.
- **Known gaps, deliberately deferred** (do not treat as oversights): no rate limiting on `POST /api/login` at any
  level; `config/sanctum.php` `expiration` is `null`; tokens carry no abilities; prior tokens are not revoked on
  re-login. When throttling lands, first decouple the `logout`/`me` tests from `/api/login` or they will trip the
  limiter. Prefer per-device token names plus expiry over revoking on re-login, which silently breaks multi-device
  clients.
- Covered by `tests/Feature/Http/Controllers/Auth/LoginControllerTest.php` (12 tests) and
  `tests/Feature/Http/Controllers/Auth/AuthControllerTest.php` (register/logout/me).
