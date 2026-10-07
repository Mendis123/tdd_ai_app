# Frontend Task Management

The tasks feature follows the auth feature's split by responsibility (see [frontend-auth.md](frontend-auth.md)).
Add list/show/edit/delete into the same files rather than inventing a new layout.

- **Where things live.** Raw HTTP in `src/utils/api/taskApi.ts` (unwraps Laravel's `data` via `ApiResource<T>`);
  types in `src/utils/types/task.ts`; options, defaults, field order and copy in `src/utils/constants/task.ts`;
  form → payload conversion in `src/utils/mappers/taskMappers.ts`; client validation in
  `src/utils/validation/validateTaskForm.ts`; Redux in `src/features/tasks/` (slice, thunks, selectors, one hook per
  flow such as `useCreateTask`).
- **Status and priority types are derived from `TASK_STATUS_OPTIONS` / `TASK_PRIORITY_OPTIONS`.** Those lists
  mirror the PHP enums `App\Enums\TaskStatus` / `TaskPriority`; change both sides together.
- **Form values use the API's field names** (`due_date`, not `dueDate`) so a 422 `errors` bag maps straight onto
  the fields. Server messages for rendered fields show inline; only errors with no matching field become a
  form-level `Alert`.
- **`TaskForm` (`src/components/tasks/`) owns fields, validation and error display only.** The page owns the request
  and what follows success, so the same form serves create and edit. `TaskCreatePage` remounts it via `key` to reset.
- **Thunks use `createAppAsyncThunk`** (`src/app/createAppAsyncThunk.ts`), typed with `RootState` and an `ApiError`
  reject value. The slice tracks the in-flight `requestId` so a response landing after `createTaskReset` (screen
  unmounted) is ignored, and it resets on `sessionCleared` / `signOut.fulfilled` so task state never outlives the
  user who loaded it. Task state is not persisted.
- **Sidebar entries are data** in `src/utils/constants/navigation.ts` (`NavigationSection[]`); add task links to
  the "Task management" section there, not in `Sidebar.tsx`.
- **Form controls share `FormField` + `fieldControlClassName`** (`src/components/ui/`). New controls should wrap
  `FormField` rather than re-implementing label/error/`aria-describedby` wiring.
