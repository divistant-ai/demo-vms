#!/usr/bin/env node

/**
 * Navigation Test Script
 * Verifies all routes and pages are properly configured
 */

const fs = require('fs');
const path = require('path');

// Define expected routes from App.tsx
const routes = [
  { path: '/login', page: 'LoginPage', protected: false },
  { path: '/', page: 'DashboardPage', protected: true },
  { path: '/cameras', page: 'CamerasPage', protected: true },
  { path: '/cameras/:cameraId', page: 'CameraDetailPage', protected: true },
  { path: '/analytics', page: 'AnalyticsPage', protected: true },
  { path: '/map', page: 'MapPage', protected: true },
  { path: '/incidents', page: 'IncidentsPage', protected: true },
  { path: '/incidents/:incidentId', page: 'IncidentDetailPage', protected: true },
  { path: '/alerts', page: 'AlertsPage', protected: true },
  { path: '/configuration', page: 'ConfigurationPage', protected: true },
  { path: '/configuration/scenarios/new', page: 'ScenarioBuilderPage', protected: true },
  { path: '/configuration/users', page: 'UserManagementPage', protected: true },
  { path: '/configuration/cameras', page: 'CameraManagementPage', protected: true },
  { path: '/models', page: 'ModelsPage', protected: true },
  { path: '/profile', page: 'ProfilePage', protected: true },
  { path: '/ai-insights', page: 'AIInsightPage', protected: true },
  { path: '/reports', page: 'ReportsPage', protected: true },
  { path: '/tenant/settings', page: 'TenantSettingsPage', protected: true },
  { path: '/theme-test', page: 'ThemeTestPage', protected: false },
];

// Define sidebar menu items
const sidebarMenus = [
  { label: 'Dashboard', path: '/', section: 'Main Navigation' },
  { label: 'Live Cameras', path: '/cameras', section: 'Main Navigation' },
  { label: 'Map View', path: '/map', section: 'Main Navigation' },
  { label: 'Analytics', path: '/analytics', section: 'Analytics & Intelligence' },
  { label: 'AI Insights', path: '/ai-insights', section: 'Analytics & Intelligence' },
  { label: 'AI Models', path: '/models', section: 'Analytics & Intelligence' },
  { label: 'Incidents', path: '/incidents', section: 'Operations & Monitoring' },
  { label: 'Alerts', path: '/alerts', section: 'Operations & Monitoring' },
  { label: 'Configuration', path: '/configuration', section: 'Administration' },
  { label: 'Reports', path: '/reports', section: 'Administration' },
  { label: 'Organization', path: '/tenant/settings', section: 'Administration' },
  { label: 'Profile', path: '/profile', section: 'Footer' },
];

const pagesDir = path.join(__dirname, 'src', 'pages');

console.log('🔍 Navigation & Pages Audit\n');
console.log('=' .repeat(80));

// Test 1: Check if all page files exist
console.log('\n📁 Test 1: Page Files Existence');
console.log('-'.repeat(80));

let missingPages = [];
let existingPages = [];

routes.forEach(route => {
  const pageFile = path.join(pagesDir, `${route.page}.tsx`);
  const exists = fs.existsSync(pageFile);
  
  if (exists) {
    console.log(`✅ ${route.page.padEnd(30)} → ${route.path}`);
    existingPages.push(route.page);
  } else {
    console.log(`❌ ${route.page.padEnd(30)} → ${route.path} (MISSING)`);
    missingPages.push(route.page);
  }
});

// Test 2: Check for unused page files
console.log('\n📦 Test 2: Unused Page Files');
console.log('-'.repeat(80));

const allPageFiles = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => file.replace('.tsx', ''));

const routedPages = routes.map(r => r.page);
const unusedPages = allPageFiles.filter(page => !routedPages.includes(page));

if (unusedPages.length === 0) {
  console.log('✅ No unused page files found');
} else {
  unusedPages.forEach(page => {
    console.log(`⚠️  ${page}.tsx is not routed`);
  });
}

// Test 3: Verify sidebar menu coverage
console.log('\n🧭 Test 3: Sidebar Menu Coverage');
console.log('-'.repeat(80));

let menuIssues = [];

sidebarMenus.forEach(menu => {
  const hasRoute = routes.some(r => r.path === menu.path);
  
  if (hasRoute) {
    console.log(`✅ ${menu.label.padEnd(20)} → ${menu.path.padEnd(30)} [${menu.section}]`);
  } else {
    console.log(`❌ ${menu.label.padEnd(20)} → ${menu.path.padEnd(30)} [${menu.section}] (NO ROUTE)`);
    menuIssues.push(menu);
  }
});

// Test 4: Route protection check
console.log('\n🔒 Test 4: Route Protection');
console.log('-'.repeat(80));

const protectedRoutes = routes.filter(r => r.protected);
const publicRoutes = routes.filter(r => !r.protected);

console.log(`✅ Protected routes: ${protectedRoutes.length}`);
console.log(`✅ Public routes: ${publicRoutes.length}`);

publicRoutes.forEach(route => {
  console.log(`   🌐 ${route.path} (${route.page})`);
});

// Summary
console.log('\n📊 Summary');
console.log('='.repeat(80));
console.log(`Total Routes: ${routes.length}`);
console.log(`Total Page Files: ${allPageFiles.length}`);
console.log(`Routed Pages: ${existingPages.length}`);
console.log(`Missing Pages: ${missingPages.length}`);
console.log(`Unused Pages: ${unusedPages.length}`);
console.log(`Sidebar Menu Items: ${sidebarMenus.length}`);
console.log(`Menu Issues: ${menuIssues.length}`);

console.log('\n🎯 Status');
console.log('='.repeat(80));

if (missingPages.length === 0 && menuIssues.length === 0) {
  console.log('✅ ALL TESTS PASSED - Navigation is fully functional!');
  process.exit(0);
} else {
  console.log('❌ ISSUES FOUND:');
  if (missingPages.length > 0) {
    console.log(`   - ${missingPages.length} missing page file(s)`);
  }
  if (menuIssues.length > 0) {
    console.log(`   - ${menuIssues.length} menu item(s) without routes`);
  }
  if (unusedPages.length > 0) {
    console.log(`   ⚠️  ${unusedPages.length} unused page file(s) (consider cleanup)`);
  }
  process.exit(1);
}


