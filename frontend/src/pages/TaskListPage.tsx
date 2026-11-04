import { Link, Navigate, useSearchParams } from "react-router";
import { ListIcon, PlusIcon } from "../assets/svg/index.ts";
import { TaskTable } from "../components/tasks/TaskTable.tsx";
import { Alert } from "../components/ui/Alert.tsx";
import { Button } from "../components/ui/Button.tsx";
import { buttonClassName } from "../components/ui/buttonStyles.ts";
import { Pagination } from "../components/ui/Pagination.tsx";
import { Spinner } from "../components/ui/Spinner.tsx";
import { useTaskList } from "../features/tasks/useTaskList.ts";
import { TASK_LIST_TEXT } from "../utils/constants/task.ts";

/** Reads `?page=` as a whole number of at least 1; anything else means the first page. */
function toPageNumber(value: string | null): number {
    const page = Number(value);

    return Number.isInteger(page) && page >= 1 ? page : 1;
}

const CARD_CLASS_NAME =
    "overflow-hidden rounded-xl bg-white shadow-xs ring-1 ring-slate-900/5";

export function TaskListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    /* The page lives in the URL, so reload, back/forward and shared links all land on it. */
    const page = toPageNumber(searchParams.get("page"));
    const { tasks, meta, listStatus, listError, reloadTasks } =
        useTaskList(page);

    const isLoading = listStatus === "pending";
    const hasLoaded = meta !== null;

    /* Past the end, e.g. an old link after tasks were removed: show the last page instead of an empty one. */
    if (listStatus === "fulfilled" && meta && page > meta.last_page) {
        return (
            <Navigate
                to={{
                    search: meta.last_page > 1 ? `?page=${meta.last_page}` : "",
                }}
                replace
            />
        );
    }

    function handlePageChange(nextPage: number) {
        setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {});
    }

    return (
        <div className="max-w-6xl">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {TASK_LIST_TEXT.heading}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {TASK_LIST_TEXT.subheading}
                    </p>
                </div>

                <Link
                    to="/tasks/create"
                    className={`${buttonClassName()} self-start sm:self-auto`}
                >
                    <PlusIcon className="size-4" />
                    {TASK_LIST_TEXT.createTask}
                </Link>
            </header>

            {listError ? (
                <div className="mt-6 flex flex-col items-start gap-3">
                    <Alert>{listError.message}</Alert>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={reloadTasks}
                    >
                        {TASK_LIST_TEXT.retry}
                    </Button>
                </div>
            ) : null}

            {!hasLoaded && !listError ? (
                <div
                    className={`${CARD_CLASS_NAME} mt-6 grid place-items-center py-16`}
                    role="status"
                    aria-live="polite"
                >
                    <Spinner className="size-7 text-brand-600" />
                    <span className="sr-only">{TASK_LIST_TEXT.loading}</span>
                </div>
            ) : null}

            {hasLoaded && meta.total === 0 ? (
                <section
                    className={`${CARD_CLASS_NAME} mt-6 flex flex-col items-center px-6 py-16 text-center`}
                >
                    <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600">
                        <ListIcon className="size-6" />
                    </span>
                    <h2 className="mt-4 text-base font-semibold text-slate-900">
                        {TASK_LIST_TEXT.emptyHeading}
                    </h2>
                    <p className="mt-1 max-w-sm text-sm text-slate-600">
                        {TASK_LIST_TEXT.emptyBody}
                    </p>
                    <Link
                        to="/tasks/create"
                        className={`${buttonClassName()} mt-6`}
                    >
                        <PlusIcon className="size-4" />
                        {TASK_LIST_TEXT.createTask}
                    </Link>
                </section>
            ) : null}

            {hasLoaded && meta.total > 0 ? (
                <section className={`${CARD_CLASS_NAME} mt-6`}>
                    <TaskTable tasks={tasks} isBusy={isLoading} />

                    <div className="border-t border-slate-200 px-4 py-3 sm:px-6">
                        <Pagination
                            meta={meta}
                            onPageChange={handlePageChange}
                            disabled={isLoading}
                        />
                    </div>
                </section>
            ) : null}
        </div>
    );
}
