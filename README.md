# Visiant - AI-Powered Video Management System

Platform observability dan analytics untuk video surveillance yang mengintegrasikan AI-powered detection dan customizable analytics scenarios untuk Smart City, Retail, Logistics, Manufacturing, dan berbagai industri lainnya.

**Website:** [visiant.com](https://visiant.com)

## ✨ Overview

Visiant adalah platform Video Management System (VMS) berbasis SaaS yang dirancang khusus untuk multi-tenancy dengan fitur industry-specific customization. Platform ini menggunakan AI untuk mendeteksi berbagai kejadian, menganalisis pola, dan memberikan insights real-time untuk meningkatkan efisiensi operasional.

### 🎯 Key Features

- **Multi-Tenancy SaaS Architecture** - Isolated data per tenant dengan subscription-based model
- **Industry-Specific Templates** - Pre-configured dashboards untuk 6+ industri
- **AI-Powered Detection** - 12+ AI models untuk berbagai use cases
- **Real-time Streaming Data** - Live updates tanpa reload
- **Dynamic Dashboard** - Customizable widgets berdasarkan industri
- **Integration Marketplace** - Connect dengan POS, WMS, ERP, dan tools lainnya
- **Compliance Reports** - GDPR, HIPAA, ISO 27001, dan standar lainnya
- **Industry Benchmarks** - Compare performance dengan industry average
- **White-Label Branding** - Custom colors, logo, domain, dan font
- **Multi-Language Support** - English, Indonesian, dan bahasa lainnya

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/divistant-ai/demo-vms.git
cd demo-vms/vms-platform

# Install dependencies
npm install

# Run development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173/`

### Default Login
- **Email:** admin@example.com
- **Password:** (any password)

## 📦 Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript 5.9
- **Build Tool:** Vite 5.4.11
- **Styling:** Tailwind CSS v4 + Catalyst UI Kit
- **State Management:** TanStack Query (React Query) + Zustand
- **Charts:** Recharts 3.3
- **Maps:** Leaflet + React Leaflet
- **Routing:** React Router v7
- **Date Handling:** date-fns 4.1
- **UI Components:** Headless UI + Custom Catalyst Components

### Development & Testing
- **Testing:** Playwright (E2E)
- **Linting:** ESLint 9 + TypeScript ESLint
- **Code Quality:** Prettier, Husky, Lint-staged
- **Bundle Analysis:** Rollup Plugin Visualizer

## 🏗️ Architecture

### Multi-Tenancy Model
```
┌─────────────────────────────────────────┐
│           Visiant Platform              │
├─────────────────────────────────────────┤
│  Tenant A    │  Tenant B    │  Tenant C │
│  (Retail)    │  (Smart City)│  (Logistics)│
├──────────────┼──────────────┼───────────┤
│  Custom      │  Custom      │  Custom   │
│  Dashboard   │  Dashboard   │  Dashboard│
├──────────────┼──────────────┼───────────┤
│  Isolated    │  Isolated    │  Isolated │
│  Data        │  Data        │  Data     │
└──────────────┴──────────────┴───────────┘
```

### Subscription Tiers
1. **Free** - Up to 5 cameras, basic features
2. **Starter** - Up to 20 cameras, analytics
3. **Professional** - Up to 100 cameras, AI models, integrations
4. **Enterprise** - Unlimited cameras, white-label, custom AI models

## 📁 Project Structure

```
vms-platform/
├── src/
│   ├── components/
│   │   ├── catalyst/          # Catalyst UI Kit components
│   │   ├── layout/            # MainLayout, Navbar, Sidebar
│   │   ├── dashboard/         # Dashboard widgets
│   │   └── common/            # Reusable components
│   ├── pages/                 # All pages (30+ pages)
│   │   ├── DashboardPage.tsx
│   │   ├── MapPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── TenantSettingsPage.tsx
│   │   ├── IndustryProfilePage.tsx
│   │   ├── AIModelsMarketplacePage.tsx
│   │   ├── IntegrationMarketplacePage.tsx
│   │   ├── ComplianceReportsPage.tsx
│   │   ├── IndustryBenchmarksPage.tsx
│   │   ├── WhiteLabelPage.tsx
│   │   └── ... (20+ more pages)
│   ├── services/
│   │   ├── api/              # API services
│   │   ├── realtime/         # Real-time data service
│   │   └── mock/             # Mock data
│   ├── contexts/             # React contexts
│   │   ├── ThemeContext.tsx
│   │   ├── TenantContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── useRealtimeData.ts
│   │   ├── useTenant.ts
│   │   └── useTheme.ts
│   ├── types/                # TypeScript types
│   │   ├── tenant.ts
│   │   ├── industry.ts
│   │   ├── camera.ts
│   │   └── ... (10+ type files)
│   ├── data/                 # Static data
│   │   └── industryProfiles.ts
│   ├── styles/               # Global styles
│   │   ├── design-tokens.css
│   │   ├── components.css
│   │   └── index.css
│   └── utils/                # Utility functions
├── e2e/                      # E2E tests (Playwright)
├── public/                   # Static assets
└── package.json
```

## 🛣️ Routes & Navigation

### Main Navigation
- `/` - Dashboard (Default or Dynamic based on industry)
- `/map` - Map View dengan camera markers
- `/analytics` - Analytics Dashboard
- `/cameras` - Camera Management
- `/incidents` - Incident Management
- `/alerts` - Alert History
- `/reports` - Reports & Export

### AI & Automation
- `/scenarios` - AI Automation Scenarios
- `/industry/models` - AI Models Marketplace

### Industry
- `/industry/profile` - Industry Profile Settings
- `/industry/templates` - Industry Templates
- `/industry/integrations` - Integration Marketplace
- `/industry/compliance` - Compliance Reports
- `/industry/benchmarks` - Industry Benchmarks
- `/industry/branding` - White-Label Branding

### Configuration
- `/configuration` - System Configuration
- `/tenant/settings` - Organization Settings

### Administration
- `/users` - User Management
- `/audit-logs` - Audit Logs

### User
- `/profile` - User Profile
- `/onboarding` - Onboarding Flow (first-time users)
- `/login` - Login Page

## 🎨 Design System

### Color Palette
- **Primary:** Blue (#3B82F6) - Professional & trustworthy
- **Secondary:** Purple (#8B5CF6) - Innovation & AI
- **Accent:** Cyan (#06B6D4) - Highlights & CTAs
- **Neutral:** Zinc (50-950) - Modern & clean

### Design Tokens
- Comprehensive CSS variables untuk colors, spacing, typography, shadows, border-radius, z-index, dan transitions
- Dark mode support dengan automatic color adjustments
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Components Library
- 50+ reusable components
- Catalyst UI Kit integration
- Custom utility classes untuk cards, badges, alerts, skeleton loaders, progress bars, tooltips

## 🧪 Testing

### E2E Tests (Playwright)
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

### Test Coverage
- ✅ Authentication flow
- ✅ Onboarding flow
- ✅ Navigation & routing
- ✅ Industry profile selection
- ✅ Theme switching
- ✅ Responsive design
- ✅ User journeys

## 📊 Industry Profiles

### Supported Industries
1. **Smart City** - Traffic, flood, crowd monitoring
2. **Retail** - People counting, queue management, theft detection
3. **Logistics** - Warehouse monitoring, vehicle tracking, loading dock
4. **Manufacturing** - Production line, safety compliance, quality control
5. **Healthcare** - Patient monitoring, restricted area, equipment tracking
6. **Port & Maritime** - Vessel tracking, stevedoring, stockpile monitoring

Each industry memiliki:
- Pre-configured dashboard widgets
- Recommended AI models
- Custom scenarios
- Specific KPIs
- Integration recommendations
- Compliance requirements

## 🔌 Integrations

### Available Integrations
- **Retail:** POS Systems, Inventory Management
- **Logistics:** WMS, TMS, ERP Systems
- **Smart City:** Traffic Control, Emergency Services
- **Communication:** Slack, Email, SMS
- **Storage:** Cloud Storage, BYOS

## 🤖 AI Models Marketplace

### Available Models (12+)
- Person Detection Pro
- Vehicle Detection & Classification
- Face Recognition Enterprise
- Intrusion Detection
- Fire & Smoke Detection
- PPE Compliance Checker
- Queue Analytics
- Crowd Density Estimator
- License Plate Recognition
- Object Tracking Pro
- Anomaly Detection
- Behavior Analysis

## 📈 Business Model (SaaS)

### Revenue Streams
1. **Subscription Fees** - Monthly/Annual recurring revenue
2. **AI Model Marketplace** - Commission dari model providers
3. **Integration Fees** - Premium integrations
4. **White-Label** - Enterprise branding customization
5. **Professional Services** - Implementation, training, support

### Pricing Strategy
- **Freemium Model** - Free tier untuk acquisition
- **Usage-Based** - Per camera, per AI model
- **Tiered Pricing** - Clear upgrade path
- **Enterprise Custom** - Negotiated pricing untuk large deployments

## 🔒 Security & Compliance

### Data Security
- Tenant data isolation
- Encrypted storage
- Role-based access control (RBAC)
- Audit logs untuk semua actions

### Compliance
- GDPR compliant
- HIPAA ready (Healthcare)
- ISO 27001 guidelines
- SOC 2 Type II (planned)
- PCI DSS (Retail payments)

## 🌐 Internationalization

### Supported Languages
- English (default)
- Indonesian
- More languages coming soon

## 🎨 White-Label Features

### Customization Options
- Company name & tagline
- Logo & favicon
- Primary, secondary, accent colors
- Custom domain (CNAME)
- Font family
- Login background
- Remove "Powered by Visiant"

## 📝 Development

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Prefer `type` over `interface`
- Use `Array<T>` instead of `T[]`
- No `any` types (use `unknown`)

### Git Workflow
- Feature branches: `feature/feature-name`
- Commit convention: Conventional Commits
- Pre-commit hooks: lint-staged + husky

### Build
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

**Node.js Version**
- Requires Node.js 18+
- Recommended: Node.js 20 LTS

**Port Already in Use**
```bash
# Change port in vite.config.ts or use
npm run dev -- --port 3000
```

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 Documentation

### Additional Docs
- [Navigation Guide](./NAVIGATION_GUIDE.md)
- [SaaS Business Model](./SAAS_BUSINESS_MODEL.md)
- [UI/UX Improvements](./UI_UX_IMPROVEMENTS_SUMMARY.md)
- [Testing Results](./TESTING_RESULTS.md)

## 🤝 Contributing

Untuk internal development team only. Silakan ikuti coding standards dan testing requirements sebelum submit PR.

## 📞 Support

- **Website:** [visiant.com](https://visiant.com)
- **Email:** support@visiant.com
- **Documentation:** [docs.visiant.com](https://docs.visiant.com)

## 📄 License

© 2024 Visiant. All rights reserved.

---

**Built with ❤️ by Visiant Team**
