export type ButtonVariant = "primary" | "secondary" | "danger";

export type ButtonSize = "md" | "sm";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
        "bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-brand-600",
    secondary:
        "bg-white text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-slate-600",
    danger: "bg-white text-red-600 ring-1 ring-red-200 ring-inset hover:bg-red-50 active:bg-red-100 focus-visible:outline-red-600",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    md: "h-11 gap-2 px-4",
    /* Compact, for controls repeated on every row of a table. */
    sm: "h-8 gap-1.5 px-2.5",
};

/** Button styling on its own, so a router `Link` can look like a `Button`. */
export function buttonClassName(
    variant: ButtonVariant = "primary",
    size: ButtonSize = "md",
): string {
    return `inline-flex items-center justify-center rounded-lg text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`;
}
