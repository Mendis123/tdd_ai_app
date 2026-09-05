# Per-User Resource Ownership

All `tasks` routes require `auth:sanctum` and are scoped to the authenticated user.

- Write actions (`store`/`index`) go through `$request->user()->tasks()`, never `Task::query()`/`Task::create()` directly, so a task is always attributed to its creator regardless of any client-supplied `user_id` (which is also excluded from `Task`'s `#[Fillable]` as defense in depth).
- Read/update/delete actions (`show`/`update`/`destroy`) rely on `Task::resolveRouteBinding()` (see `app/Models/Task.php`) scoping the implicit route-model binding to `auth()->id()`. A task belonging to another user resolves to `null`, which Laravel turns into a 404 — not a 403 — so one user can't learn that another user's task exists.
- This pattern (scoped `resolveRouteBinding` rather than a policy) is deliberately minimal: the only rule is "must be the owner." If a second authorization rule appears later (e.g. an admin role), that's the trigger to introduce a real `TaskPolicy` — not before.
- Covered by `tests/Feature/Http/Controllers/TaskControllerTest.php` (401 without auth, 404 for another user's task, list/create scoping) and `tests/Feature/Http/Controllers/Auth/AuthControllerTest.php` (register/login/logout/me).
