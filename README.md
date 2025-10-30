# VMS Platform - Smart City Video Management System

Platform observability dan analytics untuk video surveillance yang mengintegrasikan AI-powered detection dan customizable analytics scenarios untuk Smart City use cases.

## ✅ Fitur yang Telah Diimplementasi

### Core Features
- ✅ **Dashboard**: Overview cards, statistik sistem, charts (Line & Pie), recent alerts
- ✅ **Live Camera View**: Multi-view grid (1x1, 2x2, 4x4), mock video streams dengan canvas animation, camera status
- ✅ **Analytics Dashboard**: Time series charts, distribusi incidents, heatmap visualization
- ✅ **Incident Management**: Daftar incidents dengan tabel, filtering, dan detail view
- ✅ **Alert System**: Real-time notifications via WebSocket mock, alert history, acknowledge functionality
- ✅ **Configuration**: Detection scenarios management, camera management, user management tabs
- ✅ **Reports**: Report generation dengan export CSV/PDF, scheduled reports placeholder

### Technical Implementation
- ✅ TypeScript types (menggunakan `type Something = {...}` sesuai preferensi)
- ✅ Catalyst UI Kit components terintegrasi lengkap
- ✅ TanStack Query untuk state management & data fetching
- ✅ Mock data layer lengkap (cameras, incidents, alerts, analytics)
- ✅ Mock WebSocket untuk real-time updates
- ✅ React Router untuk routing dengan protected routes
- ✅ Responsive design dengan Tailwind CSS
- ✅ Build production berhasil tanpa error

## 🚀 Cara Menjalankan

```bash
cd vms-platform
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173/`

## 📁 Struktur Aplikasi

```
vms-platform/
├── src/
│   ├── components/
│   │   ├── catalyst/          # Semua komponen Catalyst UI Kit
│   │   ├── layout/            # MainLayout dengan sidebar & navbar
│   │   ├── common/            # Reusable components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── cameras/           # Camera components
│   │   ├── analytics/         # Analytics components
│   │   ├── incidents/         # Incident components
│   │   └── alerts/            # Alert components
│   ├── pages/                 # Semua halaman utama
│   │   ├── DashboardPage.tsx
│   │   ├── CamerasPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── IncidentsPage.tsx
│   │   ├── AlertsPage.tsx
│   │   ├── ConfigurationPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── LoginPage.tsx
│   ├── services/
│   │   ├── api/              # Mock API services
│   │   ├── mock/             # Mock data
│   │   └── websocket/        # Mock WebSocket implementation
│   ├── types/                # TypeScript type definitions
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   └── store/                # Zustand stores
├── public/                   # Static assets
└── package.json
```

## 🛣️ Routes

- `/` - Dashboard
- `/cameras` - Live Camera View
- `/analytics` - Analytics Dashboard
- `/incidents` - Incident Management
- `/alerts` - Alert History & Real-time Notifications
- `/configuration` - System Configuration (Scenarios, Cameras, Users)
- `/reports` - Reports & Export
- `/login` - Login Page

## 🔧 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 5.4.11
- **Styling**: Tailwind CSS v4 + Catalyst UI Kit
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Routing**: React Router v7
- **Date Handling**: date-fns
- **UI Components**: Headless UI + Catalyst UI Kit

## 📝 Catatan

Aplikasi ini adalah **frontend demo platform** dengan mock data. Tidak ada backend atau database yang digunakan. Semua fitur menggunakan simulated API responses dan mock data.

### Real-time Updates
- Mock WebSocket mengirim alert secara random setiap 5-10 detik
- Alert notifications muncul sebagai dialog modal
- Alert history dapat di-acknowledge

### Mock Data
- Semua data disimpan di memory dan akan reset setiap kali aplikasi dimuat ulang
- Mock cameras, incidents, alerts, dan analytics data tersedia

## ✅ Status Implementasi

Semua fitur utama dari BRD/TRD telah diimplementasi:
- ✅ Dashboard & Navigation
- ✅ Live Camera View dengan multi-view grid
- ✅ Real-time Alerts & Notifications
- ✅ Analytics Dashboard
- ✅ Incident Management
- ✅ Configuration Panel
- ✅ Reports dengan Export functionality
- ✅ Responsive Design
- ✅ Mock Data Layer
- ✅ Real-time Simulation via WebSocket

## 📦 Build Production

```bash
npm run build
```

Build output akan tersedia di folder `dist/`

## 🐛 Troubleshooting

Jika ada masalah dengan Node.js version:
- Aplikasi menggunakan Vite 5.4.11 yang kompatibel dengan Node.js 18+
- Pastikan Node.js versi 18 atau lebih tinggi

## 📄 License

Private - Internal use only
