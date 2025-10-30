import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import { MainLayout } from './components/layout/MainLayout'
import { LoadingState } from './utils/loadingStates'

// Eager load critical pages
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ThemeTestPage } from './pages/ThemeTestPage'

// Lazy load all other pages
const CamerasPage = lazy(() => import('./pages/CamerasPage').then(m => ({ default: m.CamerasPage })))
const CameraDetailPage = lazy(() => import('./pages/CameraDetailPage').then(m => ({ default: m.CameraDetailPage })))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const MapPage = lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })))
const IncidentsPage = lazy(() => import('./pages/IncidentsPage').then(m => ({ default: m.IncidentsPage })))
const IncidentDetailPage = lazy(() => import('./pages/IncidentDetailPage').then(m => ({ default: m.IncidentDetailPage })))
const AlertsPage = lazy(() => import('./pages/AlertsPage').then(m => ({ default: m.AlertsPage })))
const ConfigurationPage = lazy(() => import('./pages/ConfigurationPage').then(m => ({ default: m.ConfigurationPage })))
const ScenarioBuilderPage = lazy(() => import('./pages/ScenarioBuilderPage').then(m => ({ default: m.ScenarioBuilderPage })))
const UserManagementPage = lazy(() => import('./pages/UserManagementPage').then(m => ({ default: m.UserManagementPage })))
const CameraManagementPage = lazy(() => import('./pages/CameraManagementPage').then(m => ({ default: m.CameraManagementPage })))
const ModelsPage = lazy(() => import('./pages/ModelsPage').then(m => ({ default: m.ModelsPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const AIInsightPage = lazy(() => import('./pages/AIInsightPage').then(m => ({ default: m.AIInsightPage })))
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated
  const user = localStorage.getItem('user')
  const isAuthenticated = !!user
  return isAuthenticated ? (
    <Suspense fallback={
      <MainLayout>
        <LoadingState message="Loading..." />
      </MainLayout>
    }>
      {children}
    </Suspense>
  ) : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/theme-test" element={<ThemeTestPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cameras"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CamerasPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cameras/:cameraId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CameraDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MapPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
             <Route
               path="/incidents"
               element={
                 <ProtectedRoute>
                   <MainLayout>
                     <IncidentsPage />
                   </MainLayout>
                 </ProtectedRoute>
               }
             />
             <Route
               path="/incidents/:incidentId"
               element={
                 <ProtectedRoute>
                   <MainLayout>
                     <IncidentDetailPage />
                   </MainLayout>
                 </ProtectedRoute>
               }
             />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AlertsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuration"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ConfigurationPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuration/scenarios/new"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ScenarioBuilderPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuration/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UserManagementPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuration/cameras"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CameraManagementPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/models"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ModelsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AIInsightPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReportsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
