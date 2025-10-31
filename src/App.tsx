import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import { TenantProvider } from './contexts/TenantContext'
import { MainLayout } from './components/layout/MainLayout'
import { LoadingState } from './utils/loadingStates'

// Eager load critical pages
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ThemeTestPage } from './pages/ThemeTestPage'
import { OnboardingPage } from './pages/OnboardingPage'

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
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })))
const ScenariosPage = lazy(() => import('./pages/ScenariosPage').then(m => ({ default: m.ScenariosPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const AIInsightPage = lazy(() => import('./pages/AIInsightPage').then(m => ({ default: m.AIInsightPage })))
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })))
const TenantSettingsPage = lazy(() => import('./pages/TenantSettingsPage').then(m => ({ default: m.TenantSettingsPage })))
const IndustryProfilePage = lazy(() => import('./pages/IndustryProfilePage').then(m => ({ default: m.IndustryProfilePage })))
const IndustryTemplatesPage = lazy(() => import('./pages/IndustryTemplatesPage').then(m => ({ default: m.IndustryTemplatesPage })))
const AIModelsMarketplacePage = lazy(() => import('./pages/AIModelsMarketplacePage').then(m => ({ default: m.AIModelsMarketplacePage })))
const IntegrationMarketplacePage = lazy(() => import('./pages/IntegrationMarketplacePage').then(m => ({ default: m.IntegrationMarketplacePage })))
const ComplianceReportsPage = lazy(() => import('./pages/ComplianceReportsPage').then(m => ({ default: m.ComplianceReportsPage })))
const IndustryBenchmarksPage = lazy(() => import('./pages/IndustryBenchmarksPage').then(m => ({ default: m.IndustryBenchmarksPage })))
const WhiteLabelPage = lazy(() => import('./pages/WhiteLabelPage').then(m => ({ default: m.WhiteLabelPage })))

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
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
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
        path="/users"
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
        path="/scenarios"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ScenariosPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AuditLogsPage />
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
      <Route
        path="/tenant/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TenantSettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <IndustryProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/templates"
        element={
          <ProtectedRoute>
            <MainLayout>
              <IndustryTemplatesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/models"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AIModelsMarketplacePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/integrations"
        element={
          <ProtectedRoute>
            <MainLayout>
              <IntegrationMarketplacePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/compliance"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ComplianceReportsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/benchmarks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <IndustryBenchmarksPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/branding"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WhiteLabelPage />
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
        <TenantProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
