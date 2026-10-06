import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { EyeIcon, EyeOffIcon } from '../assets/svg/index.ts'
import { BrandMark } from '../components/BrandMark.tsx'
import { Alert } from '../components/ui/Alert.tsx'
import { Button } from '../components/ui/Button.tsx'
import { TextField } from '../components/ui/TextField.tsx'
import { useAuth } from '../features/auth/useAuth.ts'
import { APP_NAME } from '../utils/constants/app.ts'
import { SIGN_IN_TEXT } from '../utils/constants/signIn.ts'
import type { ApiError } from '../utils/types/api.ts'
import type { SignInFieldErrors } from '../utils/types/signIn.ts'
import { hasFieldErrors } from '../utils/validation/rules.ts'
import { validateSignInCredentials } from '../utils/validation/validateSignInCredentials.ts'

/**
 * The API reports a failed sign-in as a 422 on `email` with a message that
 * deliberately does not say which half was wrong. Surfacing it under the email
 * field alone would imply the email was the problem, so a rejected credential
 * pair is shown as a form-level alert only.
 */
function toServerFieldErrors(signInError: ApiError | null): SignInFieldErrors {
  if (!signInError) {
    return {}
  }

  const isCredentialFailure =
    signInError.status === 422 &&
    Boolean(signInError.fieldErrors.email) &&
    !signInError.fieldErrors.password

  if (isCredentialFailure) {
    return {}
  }

  return { email: signInError.fieldErrors.email, password: signInError.fieldErrors.password }
}

export function SignInPage() {
  const { signIn, signInStatus, signInError, clearSignInError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [clientFieldErrors, setClientFieldErrors] = useState<SignInFieldErrors>({})

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const isSubmitting = signInStatus === 'pending'
  const serverFieldErrors = toServerFieldErrors(signInError)
  const fieldErrors: SignInFieldErrors = {
    email: clientFieldErrors.email ?? serverFieldErrors.email,
    password: clientFieldErrors.password ?? serverFieldErrors.password,
  }

  /* A failed attempt must not greet the user the next time they land here. */
  useEffect(() => clearSignInError, [clearSignInError])

  /*
   * Success needs no handling here: the slice flips `status` to authenticated
   * and `RedirectIfAuthenticated` sends the user on to where they were headed.
   */
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateSignInCredentials({ email, password })
    setClientFieldErrors(errors)
    clearSignInError()

    if (hasFieldErrors(errors)) {
      const firstInvalidField = errors.email ? emailRef : passwordRef
      firstInvalidField.current?.focus()

      return
    }

    const isSignedIn = await signIn({ email: email.trim(), password })

    if (!isSignedIn) {
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
          <span className="text-lg font-semibold tracking-tight text-white">{APP_NAME}</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white text-balance">
            {SIGN_IN_TEXT.brandHeadline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-100">
            {SIGN_IN_TEXT.brandTagline}
          </p>
        </div>

        <p className="relative text-sm text-brand-200">
          &copy; {new Date().getFullYear()} {APP_NAME}
        </p>
      </aside>

      {/* Form panel. */}
      <main className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <BrandMark />
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              {APP_NAME}
            </span>
          </div>

          <header className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {SIGN_IN_TEXT.heading}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {SIGN_IN_TEXT.subheading}
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {signInError ? <Alert>{signInError.message}</Alert> : null}

            <TextField
              ref={emailRef}
              label={SIGN_IN_TEXT.emailLabel}
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={fieldErrors.email}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={SIGN_IN_TEXT.emailPlaceholder}
              autoFocus
              required
            />

            <TextField
              ref={passwordRef}
              label={SIGN_IN_TEXT.passwordLabel}
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={fieldErrors.password}
              autoComplete="current-password"
              placeholder={SIGN_IN_TEXT.passwordPlaceholder}
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={isPasswordVisible ? SIGN_IN_TEXT.hidePassword : SIGN_IN_TEXT.showPassword}
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
              {isSubmitting ? SIGN_IN_TEXT.submitting : SIGN_IN_TEXT.submit}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
