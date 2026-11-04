import { PencilIcon, TrashIcon } from "../../assets/svg/index.ts";
import {
    TASK_LIST_TEXT,
    TASK_TABLE_COLUMNS,
} from "../../utils/constants/task.ts";
import {
    formatDueDate,
    toTaskPriorityLabel,
    toTaskStatusLabel,
} from "../../utils/mappers/taskMappers.ts";
import type { Task, TaskPriority, TaskStatus } from "../../utils/types/task.ts";
import { Badge, type BadgeTone } from "../ui/Badge.tsx";
import { Button } from "../ui/Button.tsx";

const STATUS_TONES: Record<TaskStatus, BadgeTone> = {
    pending: "neutral",
    in_progress: "info",
    completed: "success",
};

const PRIORITY_TONES: Record<TaskPriority, BadgeTone> = {
    low: "neutral",
    medium: "warning",
    high: "danger",
};

type TaskTableProps = {
    tasks: Task[];
    /** Dims the rows while the next page loads; they are replaced when it arrives. */
    isBusy?: boolean;
};

/** One page of tasks. Edit and Delete are rendered but not wired up yet. */
export function TaskTable({ tasks, isBusy = false }: TaskTableProps) {
    return (
        /* Scrolls sideways on narrow screens rather than squeezing the columns. */
        <div className="overflow-x-auto">
            <table
                aria-busy={isBusy || undefined}
                className={`min-w-full divide-y divide-slate-200 text-left text-sm transition-opacity ${isBusy ? "opacity-60" : ""}`}
            >
                <caption className="sr-only">
                    {TASK_LIST_TEXT.tableCaption}
                </caption>

                <thead className="bg-slate-50">
                    <tr>
                        {TASK_TABLE_COLUMNS.map((column) => (
                            <th
                                key={column}
                                scope="col"
                                className="px-4 py-3 text-xs font-semibold tracking-wider whitespace-nowrap text-slate-500 uppercase last:text-right sm:px-6"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                    {tasks.map((task) => (
                        <tr
                            key={task.id}
                            className="align-top transition-colors hover:bg-slate-50/60"
                        >
                            <td className="max-w-64 min-w-40 px-4 py-4 font-medium break-words text-slate-900 sm:px-6">
                                {task.title}
                            </td>

                            <td className="max-w-sm min-w-56 px-4 py-4 text-slate-600 sm:px-6">
                                {task.description ? (
                                    <p
                                        className="line-clamp-2 break-words"
                                        title={task.description}
                                    >
                                        {task.description}
                                    </p>
                                ) : (
                                    <span className="text-slate-400">
                                        {TASK_LIST_TEXT.noValue}
                                    </span>
                                )}
                            </td>

                            <td className="px-4 py-4 sm:px-6">
                                <Badge tone={STATUS_TONES[task.status]}>
                                    {toTaskStatusLabel(task.status)}
                                </Badge>
                            </td>

                            <td className="px-4 py-4 sm:px-6">
                                <Badge tone={PRIORITY_TONES[task.priority]}>
                                    {toTaskPriorityLabel(task.priority)}
                                </Badge>
                            </td>

                            <td className="px-4 py-4 whitespace-nowrap text-slate-700 sm:px-6">
                                {task.due_date ? (
                                    <time dateTime={task.due_date}>
                                        {formatDueDate(task.due_date)}
                                    </time>
                                ) : (
                                    <span className="text-slate-400">
                                        {TASK_LIST_TEXT.noValue}
                                    </span>
                                )}
                            </td>

                            <td className="px-4 py-3 sm:px-6">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        aria-label={TASK_LIST_TEXT.editLabel(
                                            task.title,
                                        )}
                                    >
                                        <PencilIcon className="size-4" />
                                        {TASK_LIST_TEXT.edit}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        aria-label={TASK_LIST_TEXT.deleteLabel(
                                            task.title,
                                        )}
                                    >
                                        <TrashIcon className="size-4" />
                                        {TASK_LIST_TEXT.delete}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
