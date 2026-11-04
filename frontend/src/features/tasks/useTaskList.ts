import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import type {
    ApiError,
    PaginationMeta,
    RequestStatus,
} from "../../utils/types/api.ts";
import type { Task } from "../../utils/types/task.ts";
import {
    selectTaskListError,
    selectTaskListMeta,
    selectTaskListStatus,
    selectTasks,
} from "./tasksSelectors.ts";
import { taskListReset } from "./tasksSlice.ts";
import { fetchTasks } from "./tasksThunks.ts";

export type UseTaskListValue = {
    tasks: Task[];
    meta: PaginationMeta | null;
    listStatus: RequestStatus;
    listError: ApiError | null;
    /** Requests the current page again, e.g. after a failure. */
    reloadTasks: () => void;
};

/**
 * The task list as a screen sees it: loads `page` whenever it changes and
 * drops the list when the screen unmounts.
 */
export function useTaskList(page: number): UseTaskListValue {
    const tasks = useAppSelector(selectTasks);
    const meta = useAppSelector(selectTaskListMeta);
    const listStatus = useAppSelector(selectTaskListStatus);
    const listError = useAppSelector(selectTaskListError);
    const dispatch = useAppDispatch();

    const reloadTasks = useCallback(() => {
        dispatch(fetchTasks(page));
    }, [dispatch, page]);

    useEffect(() => {
        reloadTasks();
    }, [reloadTasks]);

    useEffect(
        () => () => {
            dispatch(taskListReset());
        },
        [dispatch],
    );

    return { tasks, meta, listStatus, listError, reloadTasks };
}
