/**
 * Surface, ring and type shared by every form control; each control adds its
 * own height and padding. An invalid control switches to the error palette.
 */
export function fieldControlClassName(hasError: boolean): string {
  return `block w-full rounded-lg bg-white text-sm text-slate-900 shadow-xs ring-1 ring-inset transition placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
    hasError
      ? 'ring-red-400 focus:ring-red-500'
      : 'ring-slate-300 hover:ring-slate-400 focus:ring-brand-600'
  }`
}
