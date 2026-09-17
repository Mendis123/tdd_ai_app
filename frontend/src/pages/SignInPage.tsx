import { useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { BrandMark } from '../components/BrandMark.tsx'
import { EyeIcon, EyeOffIcon } from '../components/icons.tsx'
import { Alert } from '../components/ui/Alert.tsx'
import { Button } from '../components/ui/Button.tsx'
import { TextField } from '../components/ui/TextField.tsx'
import { useAuth } from '../features/auth/useAuth.ts'
import { toApiError } from '../lib/apiError.ts'

type FieldErrors = { email?: string; password?: string }

/**
 * Mirrors the API's own rules so an obviously incomplete form never costs a
 * round trip. The server stays the authority: its 422 wins over anything here.
 */
function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}

  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function SignInPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  /* Return the user to whatever they were denied, defaulting to the dashboard. */
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validate(email, password)
    setFieldErrors(errors)
    setFormError(null)

    if (errors.email || errors.password) {
      const firstInvalidField = errors.email ? emailRef : passwordRef
      firstInvalidField.current?.focus()

      return
    }

    setIsSubmitting(true)

    try {
      await signIn({ email: email.trim(), password })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const apiError = toApiError(error)

      /*
       * The API reports a failed sign-in as a 422 on `email` with a message that
       * deliberately does not say which half was wrong. Surfacing it under the
       * email field alone would imply the email was the problem, so a rejected
       * credential pair is shown as a form-level alert with both fields marked.
       */
      const isCredentialFailure =
        apiError.status === 422 && Boolean(apiError.fieldErrors.email) && !apiError.fieldErrors.password

      setFormError(apiError.message)
      setFieldErrors(
        isCredentialFailure
          ? {}
          : { email: apiError.fieldErrors.email, password: apiError.fieldErrors.password },
      )
      setIsSubmitting(false)
      emailRef.current?.focus()
    }
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      {/* Brand panel: decorative, so it is dropped entirely below `lg`. */}
      <aside className="relative hidden overflow-hidden bg-brand-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(255,255,255,0.22),transparent_60%),radial-gradient(45%_45%_at_85%_85%,rgba(129,140,248,0.45),transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px]"
        />

        <div className="relative flex items-center gap-3">
          <BrandMark className="size-10 bg-white/15 shadow-none ring-1 ring-white/25" />
          <span className="text-lg font-semibold tracking-tight text-white">Personal Tracker</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white text-balance">
            Everything you meant to do, in one calm place.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-100">
            Sign in to pick up your tasks exactly where you left them.
          </p>
        </div>

        <p className="relative text-sm text-brand-200">
          &copy; {new Date().getFullYear()} Personal Tracker
        </p>
      </aside>

      {/* Form panel. */}
      <main className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <BrandMark />
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Personal Tracker
            </span>
          </div>

          <header className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome back. Enter your details to continue.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {formError ? <Alert>{formError}</Alert> : null}

            <TextField
              ref={emailRef}
              label="Email address"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={fieldErrors.email}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              autoFocus
              required
            />

            <TextField
              ref={passwordRef}
              label="Password"
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={fieldErrors.password}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={isPasswordVisible}
                  className="grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon className="size-4.5" />
                  ) : (
                    <EyeIcon className="size-4.5" />
                  )}
                </button>
              }
            />

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
