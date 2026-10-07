import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts'
import type { ApiError, RequestStatus } from '../../utils/types/api.ts'
import type { CreateTaskPayload, Task } from '../../utils/types/task.ts'
import { selectCreateTaskError, selectCreateTaskStatus } from './tasksSelectors.ts'
import { createTaskReset } from './tasksSlice.ts'
import { createTask } from './tasksThunks.ts'

export type UseCreateTaskValue = {
  /** Resolves the created task, or `null` when the request failed (see `createError`). */
  createTask: (payload: CreateTaskPayload) => Promise<Task | null>
  createStatus: RequestStatus
  createError: ApiError | null
  resetCreateTask: () => void
}

/**
 * The create flow as a screen sees it. Scoped to creation alone so a list or
 * detail screen added later does not re-render on create state it never shows.
 */
export function useCreateTask(): UseCreateTaskValue {
  const createStatus = useAppSelector(selectCreateTaskStatus)
  const createError = useAppSelector(selectCreateTaskError)
  const dispatch = useAppDispatch()

  const handleCreateTask = useCallback(
    async (payload: CreateTaskPayload) => {
      const result = await dispatch(createTask(payload))

      return createTask.fulfilled.match(result) ? result.payload : null
    },
    [dispatch],
  )

  const resetCreateTask = useCallback(() => {
    dispatch(createTaskReset())
  }, [dispatch])

  return { createTask: handleCreateTask, createStatus, createError, resetCreateTask }
}
