# UUID Primary Keys

All tables use a UUID (v7, ordered) primary key instead of an auto-incrementing integer.

- Migrations: use `$table->uuid('id')->primary();` instead of `$table->id()`. Foreign keys to these tables must use `$table->foreignUuid(...)` (or `uuidMorphs(...)` for polymorphic relations), not `foreignId`/`morphs`.
- Models: add `use Illuminate\Database\Eloquent\Concerns\HasUuids;` and the `HasUuids` trait. This is Laravel's built-in trait; it generates ordered `Str::uuid7()` values, not random v4, so index locality stays good.
- `stubs/migration.create.stub` and `stubs/model.stub` were customized so `php artisan make:model X -m` scaffolds this by default — no per-table opt-in needed.
- `users` and `personal_access_tokens` (Sanctum) were converted as the reference implementation; `personal_access_tokens.tokenable` uses `uuidMorphs` to stay compatible with `users.id`.
- Covered by `tests/Feature/UserUuidTest.php`.
