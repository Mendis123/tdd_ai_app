import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<BadgeTone, string> = {
    neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
    info: "bg-sky-50 text-sky-700 ring-sky-600/20",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    warning: "bg-amber-50 text-amber-800 ring-amber-600/20",
    danger: "bg-red-50 text-red-700 ring-red-600/20",
};

/** A short coloured label for a value such as a status. The text carries the meaning; colour only reinforces it. */
export function Badge({
    tone = "neutral",
    children,
}: {
    tone?: BadgeTone;
    children: ReactNode;
}) {
    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${TONE_CLASSES[tone]}`}
        >
            {children}
        </span>
    );
}
