import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { TaskForm } from '../components/tasks/TaskForm.tsx'
import { Alert } from '../components/ui/Alert.tsx'
import { useCreateTask } from '../features/tasks/useCreateTask.ts'
import { TASK_CREATE_TEXT } from '../utils/constants/task.ts'
import { toCreateTaskPayload } from '../utils/mappers/taskMappers.ts'
import type { Task, TaskFormValues } from '../utils/types/task.ts'

export function TaskCreatePage() {
  const navigate = useNavigate()
  const { createTask, createStatus, createError, resetCreateTask } = useCreateTask()
  const [createdTask, setCreatedTask] = useState<Task | null>(null)
  /* Bumped after each success to remount the form: blank fields, cleared errors, focus back on the title. */
  const [formKey, setFormKey] = useState(0)

  /* A failed attempt must not greet the user the next time they land here. */
  useEffect(() => resetCreateTask, [resetCreateTask])

  /*
   * There is no task list to return to yet, so a success keeps the user here,
   * ready to add another.
   */
  async function handleSubmit(values: TaskFormValues) {
    setCreatedTask(null)

    const task = await createTask(toCreateTaskPayload(values))

    if (task) {
      setCreatedTask(task)
      setFormKey((key) => key + 1)
    }
  }

  return (
    <div className="max-w-3xl">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {TASK_CREATE_TEXT.heading}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{TASK_CREATE_TEXT.subheading}</p>
      </header>

      {createdTask ? (
        <div className="mt-6">
          <Alert variant="success">{TASK_CREATE_TEXT.created(createdTask.title)}</Alert>
        </div>
      ) : null}

      <section className="mt-6 rounded-xl bg-white shadow-xs ring-1 ring-slate-900/5">
        <TaskForm
          key={formKey}
          submitLabel={TASK_CREATE_TEXT.submit}
          submittingLabel={TASK_CREATE_TEXT.submitting}
          isSubmitting={createStatus === 'pending'}
          serverError={createError}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
        />
      </section>
    </div>
  )
}
