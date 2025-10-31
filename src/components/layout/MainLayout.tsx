import { SidebarLayout } from '../catalyst/sidebar-layout'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '../catalyst/navbar'
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarFooter,
  SidebarHeading,
  SidebarDivider,
} from '../catalyst/sidebar'
import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../catalyst/dialog'
import { Button } from '../catalyst/button'
import { Text } from '../catalyst/text'
import { Badge } from '../catalyst/badge'
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from '../catalyst/dropdown'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useTenant } from '../../hooks/useTenant'
import { GlobalSearch } from '../GlobalSearch'

function DashboardIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="5" height="5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="3" width="5" height="5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="12" width="5" height="5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="12" width="5" height="5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M3 15L9 9l3 3 5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 15h-4v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M17.5 6.667L12.5 4.167L7.5 6.667L2.5 4.167V15L7.5 17.5L12.5 15L17.5 17.5V6.667Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 6.667V17.5M12.5 4.167V15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 3v2m0 10v2m7-7h-2M5 10H3m14.364 5.364L15.536 16.95M4.464 3.05 3.05 4.464m13.436 11.072L16.95 15.536M6.464 4.95 5.05 3.536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IncidentIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 2L2 7v11h16V7L10 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10v6M7 12h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.875 10a6.875 6.875 0 0 1-.11 1.188l-2.657 2.033a.625.625 0 0 0-.15.832l1.25 2.166a.625.625 0 0 1-.54.937H7.064a.625.625 0 0 1-.54-.937l1.25-2.166a.625.625 0 0 0-.15-.832L3.235 11.188A6.875 6.875 0 0 1 5.625 6.25l2.033 2.657a.625.625 0 0 0 .832.15L11.68 7.89a.625.625 0 0 0 .174-.866 6.875 6.875 0 0 1 5.021 2.976Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AIIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReportIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4 4h12v12H4V4Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8h6M7 12h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OrganizationIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8h6M7 12h4M10 3v14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IndustryIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 3a6 6 0 0 0-6 6v4a6 6 0 0 0 6 6 6 6 0 0 0 6-6V9a6 6 0 0 0-6-6Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 15h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XMarkIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 2v2m0 12v2m7-7h2M5 10H3m14.364 5.364L15.536 16.95M4.464 3.05 3.05 4.464m13.436 11.072L16.95 15.536M6.464 4.95 5.05 3.536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 17a7 7 0 1 0-14 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M13 3h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4M8 17l-5-5 5-5M3 12h12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CogIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.875 10a6.875 6.875 0 0 1-.11 1.188l-2.657 2.033a.625.625 0 0 0-.15.832l1.25 2.166a.625.625 0 0 1-.54.937H7.064a.625.625 0 0 1-.54-.937l1.25-2.166a.625.625 0 0 0-.15-.832L3.235 11.188A6.875 6.875 0 0 1 5.625 6.25l2.033 2.657a.625.625 0 0 0 .832.15L11.68 7.89a.625.625 0 0 0 .174-.866 6.875 6.875 0 0 1 5.021 2.976Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M3 9l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17V11h2v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const { tenant } = useTenant()
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Camera Offline Alert',
      message: 'Camera CAM-001 has been offline for 5 minutes',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'warning',
      read: false
    },
    {
      id: '2',
      title: 'Traffic Congestion Detected',
      message: 'High traffic congestion detected at Main Street intersection',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'info',
      read: false
    },
    {
      id: '3',
      title: 'Flood Alert',
      message: 'Water level rising at River Station A',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'critical',
      read: false
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin at 2:00 AM',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'info',
      read: true
    },
    {
      id: '5',
      title: 'Intrusion Detected',
      message: 'Unauthorized access detected at Building B',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'critical',
      read: false
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length


  // Load user data on mount
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }


  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const sidebar = (
    <Sidebar className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      <SidebarHeader className={sidebarCollapsed ? 'px-2' : ''}>
        <div className={`flex items-center gap-x-3 ${sidebarCollapsed ? 'justify-center' : 'px-2'}`}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {tenant?.name.substring(0, 2).toUpperCase() || 'VC'}
            </span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
                {tenant?.name || 'VisionCore'}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {tenant?.subscription?.tier ? 
                    tenant.subscription.tier.replace('_', ' ').charAt(0).toUpperCase() + tenant.subscription.tier.replace('_', ' ').slice(1) 
                    : 'Free'}
                </span>
                {tenant?.subscription?.status === 'active' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                )}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarBody>
        {/* Overview Section */}
        <SidebarSection>
          {!sidebarCollapsed && <SidebarHeading>Overview</SidebarHeading>}
          <SidebarItem href="/" current={location.pathname === '/'}>
            <DashboardIcon />
            {!sidebarCollapsed && <SidebarLabel>Dashboard</SidebarLabel>}
          </SidebarItem>
        </SidebarSection>

        {!sidebarCollapsed && <SidebarDivider />}

        {/* Monitoring Section */}
        <SidebarSection>
          {!sidebarCollapsed && <SidebarHeading>Monitoring</SidebarHeading>}
          <SidebarItem href="/cameras" current={location.pathname.startsWith('/cameras')}>
            <CameraIcon />
            {!sidebarCollapsed && <SidebarLabel>Live Cameras</SidebarLabel>}
          </SidebarItem>
          <SidebarItem href="/map" current={location.pathname.startsWith('/map')}>
            <MapIcon />
            {!sidebarCollapsed && <SidebarLabel>Map View</SidebarLabel>}
          </SidebarItem>
        </SidebarSection>

        {!sidebarCollapsed && <SidebarDivider />}

        {/* Analytics Section */}
        <SidebarSection>
          {!sidebarCollapsed && <SidebarHeading>Analytics</SidebarHeading>}
          <SidebarItem href="/analytics" current={location.pathname.startsWith('/analytics')}>
            <ChartIcon />
            {!sidebarCollapsed && <SidebarLabel>Analytics</SidebarLabel>}
          </SidebarItem>
          <SidebarItem href="/reports" current={location.pathname.startsWith('/reports')}>
            <ReportIcon />
            {!sidebarCollapsed && <SidebarLabel>Reports</SidebarLabel>}
          </SidebarItem>
          <SidebarItem href="/ai-insights" current={location.pathname.startsWith('/ai-insights')}>
            <AIIcon />
            {!sidebarCollapsed && <SidebarLabel>AI Insights</SidebarLabel>}
          </SidebarItem>
        </SidebarSection>

        {!sidebarCollapsed && <SidebarDivider />}

        {/* Alerts & Incidents Section */}
        <SidebarSection>
          {!sidebarCollapsed && <SidebarHeading>Alerts</SidebarHeading>}
          <SidebarItem href="/alerts" current={location.pathname.startsWith('/alerts')}>
            <AlertIcon />
            {!sidebarCollapsed && <SidebarLabel>Alerts</SidebarLabel>}
          </SidebarItem>
          <SidebarItem href="/incidents" current={location.pathname.startsWith('/incidents')}>
            <IncidentIcon />
            {!sidebarCollapsed && <SidebarLabel>Incidents</SidebarLabel>}
          </SidebarItem>
        </SidebarSection>

        {!sidebarCollapsed && <SidebarDivider />}

        {/* Configuration Section */}
        <SidebarSection>
          {!sidebarCollapsed && <SidebarHeading>Configuration</SidebarHeading>}
          <SidebarItem href="/configuration" current={location.pathname.startsWith('/configuration')}>
            <SettingsIcon />
            {!sidebarCollapsed && <SidebarLabel>System Settings</SidebarLabel>}
          </SidebarItem>
          <SidebarItem href="/models" current={location.pathname.startsWith('/models')}>
            <AIIcon />
            {!sidebarCollapsed && <SidebarLabel>AI Models</SidebarLabel>}
          </SidebarItem>
        </SidebarSection>

        {!sidebarCollapsed && <SidebarDivider />}

        {/* Administration Section */}
        <SidebarSection>
          {!sidebarCollapsed && <SidebarHeading>Administration</SidebarHeading>}
          <SidebarItem href="/tenant/settings" current={location.pathname.startsWith('/tenant')}>
            <OrganizationIcon />
            {!sidebarCollapsed && <SidebarLabel>Organization</SidebarLabel>}
          </SidebarItem>
        </SidebarSection>

        {/* Industry Section (Conditional) */}
        {tenant?.metadata?.industry && (
          <>
            {!sidebarCollapsed && <SidebarDivider />}
            <SidebarSection>
              {!sidebarCollapsed && <SidebarHeading>Industry</SidebarHeading>}
              <SidebarItem href="/industry/profile" current={location.pathname === '/industry/profile'}>
                <IndustryIcon />
                {!sidebarCollapsed && <SidebarLabel>Industry Profile</SidebarLabel>}
              </SidebarItem>
              <SidebarItem href="/industry/templates" current={location.pathname === '/industry/templates'}>
                <IndustryIcon />
                {!sidebarCollapsed && <SidebarLabel>Templates</SidebarLabel>}
              </SidebarItem>
              <SidebarItem href="/industry/benchmarks" current={location.pathname === '/industry/benchmarks'}>
                <ChartIcon />
                {!sidebarCollapsed && <SidebarLabel>Benchmarks</SidebarLabel>}
              </SidebarItem>
            </SidebarSection>
          </>
        )}
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <SidebarItem href="/profile">
            <UserIcon />
            {!sidebarCollapsed && <SidebarLabel>Profile</SidebarLabel>}
          </SidebarItem>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  )

  const navbar = (
    <Navbar>
      <NavbarSection>
        <NavbarItem 
          onClick={toggleSidebar} 
          className="hidden lg:flex cursor-pointer items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors" 
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <div className="w-6 h-6 flex items-center justify-center text-gray-700 dark:text-gray-300">
            {sidebarCollapsed ? <MenuIcon /> : <XMarkIcon />}
          </div>
        </NavbarItem>
        <div className="hidden lg:block ml-4">
          <GlobalSearch />
        </div>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem onClick={toggleTheme} className="cursor-pointer" title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </NavbarItem>
        <NavbarItem onClick={() => setShowNotifications(true)} className="cursor-pointer relative" title="Notifications">
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavbarItem>
        <Dropdown>
          <DropdownButton className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <UserIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-950 dark:text-white">
                {user?.name || 'Admin User'}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom end">
            <DropdownItem href="/profile">
              <UserIcon />
              <span>My Profile</span>
            </DropdownItem>
            <DropdownItem href="/configuration">
              <CogIcon />
              <span>Settings</span>
            </DropdownItem>
            <DropdownItem href="/tenant/settings">
              <BuildingIcon />
              <span>Organization</span>
            </DropdownItem>
            <DropdownItem onClick={() => setShowLogoutDialog(true)}>
              <LogoutIcon />
              <span>Logout</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarSection>
    </Navbar>
  )

  return (
    <>
      <SidebarLayout navbar={navbar} sidebar={sidebar} sidebarCollapsed={sidebarCollapsed}>
        <div className="transition-all duration-300">
          {children}
        </div>
      </SidebarLayout>
      
      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onClose={() => setShowNotifications(false)} size="lg">
        <DialogTitle>Notifications</DialogTitle>
        <DialogBody>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                <BellIcon />
                <p className="mt-2">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                    notification.read ? 'border-zinc-200 dark:border-zinc-800' : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    notification.type === 'critical' ? 'bg-red-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <Text className={`font-medium truncate ${notification.read ? 'text-zinc-950 dark:text-white' : 'text-blue-950 dark:text-blue-100'}`}>
                      {notification.title}
                    </Text>
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {notification.message}
                    </Text>
                    <Text className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </Text>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge color={
                      notification.type === 'critical' ? 'red' :
                      notification.type === 'warning' ? 'yellow' :
                      'blue'
                    }>
                      {notification.type}
                    </Badge>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowNotifications(false)}>
            Close
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogBody>
          <Text>
            Are you sure you want to logout? You will need to sign in again to access the platform.
          </Text>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowLogoutDialog(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

