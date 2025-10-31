# 🌲 VisionCore VMS - Navigation Tree

## Complete Site Structure

```
VisionCore VMS
│
├── 🔓 PUBLIC ROUTES
│   ├── /login                          → LoginPage
│   └── /theme-test                     → ThemeTestPage (debug)
│
└── 🔒 PROTECTED ROUTES (Requires Authentication)
    │
    ├── 🏠 MAIN NAVIGATION
    │   ├── /                           → DashboardPage
    │   │   └── Features: Overview metrics, charts, recent incidents
    │   │
    │   ├── /cameras                    → CamerasPage
    │   │   ├── Features: Camera grid, live feeds, status
    │   │   └── Detail Routes:
    │   │       └── /cameras/:cameraId  → CameraDetailPage
    │   │           └── Features: Full video, controls, metadata
    │   │
    │   └── /map                        → MapPage
    │       └── Features: Google Maps, markers, heatmap, metrics
    │
    ├── 📈 ANALYTICS & INTELLIGENCE
    │   ├── /analytics                  → AnalyticsPage
    │   │   └── Features: Charts, export CSV, trends
    │   │
    │   ├── /ai-insights                → AIInsightPage
    │   │   └── Features: AI insights, recommendations
    │   │
    │   └── /models                     → ModelsPage
    │       └── Features: Model list, add model, config
    │       └── Actions: [Add New Model] button
    │
    ├── 🚨 OPERATIONS & MONITORING
    │   ├── /incidents                  → IncidentsPage
    │   │   ├── Features: Table, filters, create incident
    │   │   ├── Actions: [Create Incident] button
    │   │   └── Detail Routes:
    │   │       └── /incidents/:incidentId → IncidentDetailPage
    │   │           └── Features: Details, timeline, comments
    │   │
    │   └── /alerts                     → AlertsPage
    │       └── Features: Real-time alerts, WebSocket, filters
    │
    ├── ⚙️ ADMINISTRATION
    │   ├── /configuration              → ConfigurationPage
    │   │   ├── Features: Config hub, navigation cards
    │   │   └── Sub-Routes:
    │   │       ├── /configuration/scenarios/new
    │   │       │   └── ScenarioBuilderPage
    │   │       │       └── Features: Create scenarios, zones, thresholds
    │   │       │
    │   │       ├── /configuration/users
    │   │       │   └── UserManagementPage
    │   │       │       └── Features: User CRUD, roles, bulk actions
    │   │       │       └── Actions: [Add User] button
    │   │       │
    │   │       └── /configuration/cameras
    │   │           └── CameraManagementPage
    │   │               └── Features: Camera CRUD, scenarios
    │   │               └── Actions: [Add Camera] button
    │   │
    │   ├── /reports                    → ReportsPage
    │   │   └── Features: Generate reports, templates, history
    │   │
    │   └── /tenant/settings            → TenantSettingsPage ⭐ NEW
    │       └── Features: Multi-tenant SaaS settings
    │       └── Tabs:
    │           ├── General             → Organization info, regional
    │           ├── Subscription        → Plan, usage, add-ons
    │           ├── Storage             → Type, config, usage
    │           ├── Security            → MFA, SSO, policies
    │           └── Billing             → Info, payment, invoices
    │
    └── 👤 USER
        └── /profile                    → ProfilePage
            └── Features: User info, preferences, theme
```

---

## Sidebar Menu Structure

```
┌─────────────────────────────────────┐
│  [AC]  Acme Corporation             │  ← Tenant Header (Dynamic)
│        Professional ●               │
├─────────────────────────────────────┤
│                                     │
│  🏠 MAIN NAVIGATION                 │
│  ├─ Dashboard                       │  → /
│  ├─ Live Cameras                    │  → /cameras
│  └─ Map View                        │  → /map
│                                     │
│  📈 ANALYTICS & INTELLIGENCE        │
│  ├─ Analytics                       │  → /analytics
│  ├─ AI Insights                     │  → /ai-insights
│  └─ AI Models                       │  → /models
│                                     │
│  🚨 OPERATIONS & MONITORING         │
│  ├─ Incidents                       │  → /incidents
│  └─ Alerts                          │  → /alerts
│                                     │
│  ⚙️ ADMINISTRATION                  │
│  ├─ Configuration                   │  → /configuration
│  ├─ Reports                         │  → /reports
│  └─ Organization ⭐                 │  → /tenant/settings
│                                     │
├─────────────────────────────────────┤
│  👤 Profile                         │  → /profile
└─────────────────────────────────────┘
```

---

## Route Hierarchy by Depth

### Level 1: Primary Routes (12)
```
/                       Dashboard
/cameras                Live Cameras
/map                    Map View
/analytics              Analytics
/ai-insights            AI Insights
/models                 AI Models
/incidents              Incidents
/alerts                 Alerts
/configuration          Configuration
/reports                Reports
/tenant/settings        Organization
/profile                Profile
```

### Level 2: Detail Routes (2)
```
/cameras/:cameraId              Camera Detail
/incidents/:incidentId          Incident Detail
```

### Level 3: Configuration Sub-Routes (3)
```
/configuration/scenarios/new    Scenario Builder
/configuration/users            User Management
/configuration/cameras          Camera Management
```

### Special Routes (2)
```
/login                  Login (public)
/theme-test             Theme Test (debug)
```

---

## Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─ Navigate to URL
       │
       ▼
┌─────────────────────┐
│   React Router      │
│   (App.tsx)         │
└──────┬──────────────┘
       │
       ├─ Check Authentication
       │  (ProtectedRoute)
       │
       ├─ YES → Continue
       │  NO  → Redirect to /login
       │
       ▼
┌─────────────────────┐
│   MainLayout        │
│   - Sidebar         │
│   - Navbar          │
│   - Content Area    │
└──────┬──────────────┘
       │
       ├─ Load Page Component
       │  (Lazy Loading)
       │
       ▼
┌─────────────────────┐
│   Page Component    │
│   - DashboardPage   │
│   - CamerasPage     │
│   - etc.            │
└──────┬──────────────┘
       │
       ├─ Fetch Data
       │  - useRealtimeData()
       │  - useQuery()
       │  - API calls
       │
       ▼
┌─────────────────────┐
│   Render UI         │
│   - Tables          │
│   - Charts          │
│   - Forms           │
└─────────────────────┘
```

---

## Context Providers Hierarchy

```
<QueryClientProvider>          ← React Query
  <ThemeProvider>              ← Dark/Light Mode
    <TenantProvider>           ← Multi-Tenancy
      <BrowserRouter>          ← Routing
        <AppRoutes>            ← Route Definitions
          <ProtectedRoute>     ← Auth Guard
            <MainLayout>       ← Layout Wrapper
              <PageComponent>  ← Actual Page
              </PageComponent>
            </MainLayout>
          </ProtectedRoute>
        </AppRoutes>
      </BrowserRouter>
    </TenantProvider>
  </ThemeProvider>
</QueryClientProvider>
```

---

## Navigation State Management

### Active Route Detection
```typescript
// In MainLayout.tsx
const location = useLocation()

// Check if current route matches
<SidebarItem 
  href="/cameras" 
  current={location.pathname.startsWith('/cameras')}
>
```

### Programmatic Navigation
```typescript
// Using useNavigate hook
const navigate = useNavigate()

// Navigate to route
navigate('/cameras')
navigate(`/cameras/${cameraId}`)
navigate('/tenant/settings')
```

### Link Navigation
```typescript
// Using SidebarItem (wraps Link)
<SidebarItem href="/cameras">
  <CameraIcon />
  <SidebarLabel>Live Cameras</SidebarLabel>
</SidebarItem>
```

---

## Authentication Flow

```
User Not Authenticated
       │
       ├─ Try to access /cameras
       │
       ▼
┌─────────────────────┐
│  ProtectedRoute     │
│  Check localStorage │
└──────┬──────────────┘
       │
       ├─ No 'user' found
       │
       ▼
┌─────────────────────┐
│  Redirect to /login │
└──────┬──────────────┘
       │
       ├─ User enters credentials
       │
       ▼
┌─────────────────────┐
│  LoginPage          │
│  - Set localStorage │
│  - Set tenantId     │
└──────┬──────────────┘
       │
       ├─ Redirect to /
       │
       ▼
┌─────────────────────┐
│  Dashboard          │
│  (Authenticated)    │
└─────────────────────┘
```

---

## Tenant Context Integration

```
Login
  │
  ├─ Set currentTenantId → localStorage
  │
  ▼
TenantProvider
  │
  ├─ Load tenant data
  │  - name: "Acme Corporation"
  │  - subscription: "professional"
  │  - settings: {...}
  │
  ▼
MainLayout
  │
  ├─ Sidebar Header
  │  - Display tenant name
  │  - Display subscription tier
  │
  └─ Organization Menu
     - Link to /tenant/settings
```

---

## Page Load Performance

### Eager Loading (Critical)
```typescript
// Loaded immediately
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
```

### Lazy Loading (Non-Critical)
```typescript
// Loaded on demand
const CamerasPage = lazy(() => import('./pages/CamerasPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
// ... all other pages
```

### Bundle Sizes
```
LoginPage:           ~5 KB
DashboardPage:       ~8 KB
CamerasPage:         ~16 KB
MapPage:             ~18 KB
AnalyticsPage:       ~23 KB
TenantSettingsPage:  ~24 KB
```

---

## Testing Matrix

| Route | Menu Item | Page | Auth | Lazy | Status |
|-------|-----------|------|------|------|--------|
| `/` | Dashboard | ✅ | ✅ | ❌ | ✅ |
| `/cameras` | Live Cameras | ✅ | ✅ | ✅ | ✅ |
| `/cameras/:id` | - | ✅ | ✅ | ✅ | ✅ |
| `/map` | Map View | ✅ | ✅ | ✅ | ✅ |
| `/analytics` | Analytics | ✅ | ✅ | ✅ | ✅ |
| `/ai-insights` | AI Insights | ✅ | ✅ | ✅ | ✅ |
| `/models` | AI Models | ✅ | ✅ | ✅ | ✅ |
| `/incidents` | Incidents | ✅ | ✅ | ✅ | ✅ |
| `/incidents/:id` | - | ✅ | ✅ | ✅ | ✅ |
| `/alerts` | Alerts | ✅ | ✅ | ✅ | ✅ |
| `/configuration` | Configuration | ✅ | ✅ | ✅ | ✅ |
| `/configuration/scenarios/new` | - | ✅ | ✅ | ✅ | ✅ |
| `/configuration/users` | - | ✅ | ✅ | ✅ | ✅ |
| `/configuration/cameras` | - | ✅ | ✅ | ✅ | ✅ |
| `/reports` | Reports | ✅ | ✅ | ✅ | ✅ |
| `/tenant/settings` | Organization | ✅ | ✅ | ✅ | ✅ |
| `/profile` | Profile | ✅ | ✅ | ✅ | ✅ |
| `/login` | - | ✅ | ❌ | ❌ | ✅ |
| `/theme-test` | - | ✅ | ❌ | ❌ | ✅ |

**Legend:**
- ✅ = Implemented
- ❌ = Not applicable
- Auth = Protected route
- Lazy = Lazy loaded

---

## Quick Reference

### Add New Route
1. Create page component in `src/pages/`
2. Add lazy import in `App.tsx`
3. Add route in `AppRoutes`
4. (Optional) Add menu item in `MainLayout.tsx`

### Add New Menu Item
1. Create icon component in `MainLayout.tsx`
2. Add `SidebarItem` in appropriate section
3. Ensure route exists in `App.tsx`

### Test Navigation
```bash
# Run automated test
node test-navigation.cjs

# Start dev server
npm run dev

# Open browser
http://localhost:5173
```

---

**Status:** ✅ ALL ROUTES FUNCTIONAL
**Last Updated:** 2025-10-30


