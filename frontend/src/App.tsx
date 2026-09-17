import { Navigate, Route, Routes } from 'react-router'
import { DashboardLayout } from './layouts/DashboardLayout.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { SignInPage } from './pages/SignInPage.tsx'
import { RedirectIfAuthenticated } from './routes/RedirectIfAuthenticated.tsx'
import { RequireAuth } from './routes/RequireAuth.tsx'

const App = () => {
  return (
    <Routes>
      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/signin" element={<SignInPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
