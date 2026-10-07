import { combineReducers, configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  type PersistConfig,
} from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { authSlice, sessionCleared } from '../features/auth/authSlice.ts'
import { restoreSession } from '../features/auth/authThunks.ts'
import { tasksSlice } from '../features/tasks/tasksSlice.ts'
import { onUnauthorized, setAuthToken } from '../utils/api/apiClient.ts'
import type { AuthState } from '../utils/types/auth.ts'

/*
 * Only the session itself survives a reload. `status` always boots as
 * `checking` and request state always boots idle, so a stale "pending" or error
 * can never be rehydrated. redux-persist falls back to a no-op storage when
 * `localStorage` throws (private browsing, blocked site data).
 */
const authPersistConfig: PersistConfig<AuthState> = {
  key: 'auth',
  keyPrefix: 'tdd_ai_app:',
  storage,
  whitelist: ['user', 'token'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice.reducer),
  tasks: tasksSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

const listenerMiddleware = createListenerMiddleware()

/*
 * Mirrors the token into the Axios client whenever it changes — sign-in,
 * rehydration, sign-out, or a 401 — so reducers stay pure and no call site has
 * to remember to do it.
 */
listenerMiddleware.startListening.withTypes<RootState>()({
  predicate: (_action, currentState, previousState) =>
    currentState.auth.token !== previousState.auth.token,
  effect: (_action, { getState }) => {
    setAuthToken(getState().auth.token)
  },
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        /* redux-persist's lifecycle actions carry functions by design. */
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
})

export type AppDispatch = typeof store.dispatch

/* A token the API rejects is no longer a session, wherever it was noticed. */
onUnauthorized(() => {
  store.dispatch(sessionCleared())
})

/* The persisted token is set on the client by now; validate it before trusting it. */
export const persistor = persistStore(store, null, () => {
  store.dispatch(restoreSession())
})
