/** Shape returned by `UserResource` on the API. */
export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  created_at: string
}

export type SignInCredentials = {
  email: string
  password: string
}

/** `POST /api/login` deliberately returns `user` unwrapped, alongside the token. */
export type SignInResponse = {
  user: AuthenticatedUser
  token: string
}
