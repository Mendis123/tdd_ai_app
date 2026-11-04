import { ChevronLeftIcon, ChevronRightIcon } from "../../assets/svg/index.ts";
import type { PaginationMeta } from "../../utils/types/api.ts";

type PaginationProps = {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    /** Blocks page changes while one is loading. */
    disabled?: boolean;
};

type PageItem = number | "gap";

/** Pages either side of the current one that are always listed. */
const SIBLING_COUNT = 1;

/**
 * The page numbers to list: the first, the last, and the current page with its
 * neighbours, with a gap marker wherever pages are skipped.
 */
function toPageItems(currentPage: number, lastPage: number): PageItem[] {
    const items: PageItem[] = [];

    for (let page = 1; page <= lastPage; page++) {
        const isEdge = page === 1 || page === lastPage;
        const isNearCurrent = Math.abs(page - currentPage) <= SIBLING_COUNT;

        if (isEdge || isNearCurrent) {
            items.push(page);
        } else if (items[items.length - 1] !== "gap") {
            items.push("gap");
        }
    }

    return items;
}

const ARROW_CLASS_NAME =
    "inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-300 ring-inset transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent";

/** A results summary with previous/next and numbered page controls for a Laravel paginator. */
export function Pagination({
    meta,
    onPageChange,
    disabled = false,
}: PaginationProps) {
    const {
        current_page: currentPage,
        last_page: lastPage,
        total,
        from,
        to,
    } = meta;
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

    return (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-medium text-slate-900">{from ?? 0}</span>–
                <span className="font-medium text-slate-900">{to ?? 0}</span> of{" "}
                <span className="font-medium text-slate-900">{total}</span>
            </p>

            {lastPage > 1 ? (
                <nav
                    aria-label="Pagination"
                    className="flex items-center gap-1"
                >
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={disabled || !hasPrevious}
                        className={ARROW_CLASS_NAME}
                    >
                        <ChevronLeftIcon className="size-4" />
                        Previous
                    </button>

                    {/* Narrow screens get a compact position instead of every page number. */}
                    <span className="px-2 text-sm text-slate-600 sm:hidden">
                        Page {currentPage} of {lastPage}
                    </span>

                    <ul className="hidden items-center gap-1 sm:flex">
                        {toPageItems(currentPage, lastPage).map(
                            (item, index) =>
                                item === "gap" ? (
                                    <li
                                        key={`gap-${index}`}
                                        aria-hidden="true"
                                        className="px-1.5 text-sm text-slate-400"
                                    >
                                        …
                                    </li>
                                ) : (
                                    <li key={item}>
                                        <button
                                            type="button"
                                            onClick={() => onPageChange(item)}
                                            disabled={
                                                disabled && item !== currentPage
                                            }
                                            aria-current={
                                                item === currentPage
                                                    ? "page"
                                                    : undefined
                                            }
                                            aria-label={`Page ${item}`}
                                            className={`inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                item === currentPage
                                                    ? "pointer-events-none bg-brand-600 text-white"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ),
                        )}
                    </ul>

                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={disabled || !hasNext}
                        className={ARROW_CLASS_NAME}
                    >
                        Next
                        <ChevronRightIcon className="size-4" />
                    </button>
                </nav>
            ) : null}
        </div>
    );
}
