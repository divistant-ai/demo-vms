import { useState } from 'react'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Badge } from '../components/catalyst/badge'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Button } from '../components/catalyst/button'
// Custom SVG Icons
function MagnifyingGlassIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM17 17l-4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FunnelIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M3 4h14M6 8h8M9 12h2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowDownTrayIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 3v10m0 0l-4-4m4 4l4-4M3 17h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 18a7 7 0 1 1 14 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CogIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.875 10a6.875 6.875 0 0 1-.11 1.188l-2.657 2.033a.625.625 0 0 0-.15.832l1.25 2.166a.625.625 0 0 1-.54.937H7.064a.625.625 0 0 1-.54-.937l1.25-2.166a.625.625 0 0 0-.15-.832L3.235 11.188A6.875 6.875 0 0 1 5.625 6.25l2.033 2.657a.625.625 0 0 0 .832.15L11.68 7.89a.625.625 0 0 0 .174-.866 6.875 6.875 0 0 1 5.021 2.976Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldCheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 2L3 5v6c0 4.418 3.582 8 8 8s8-3.582 8-8V5l-7-3Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExclamationTriangleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 6v4m0 4h.01M4 18h12a2 2 0 0 0 1.732-3L11.732 4a2 2 0 0 0-3.464 0L2.268 15A2 2 0 0 0 4 18Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type AuditLog = {
  id: string
  timestamp: Date
  user: string
  action: string
  resource: string
  resourceId: string
  status: 'success' | 'failed' | 'warning'
  ipAddress: string
  userAgent: string
  details: string
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60000),
    user: 'admin@vms.com',
    action: 'User Login',
    resource: 'Authentication',
    resourceId: 'auth-001',
    status: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0',
    details: 'Successful login from Chrome browser'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000),
    user: 'john.doe@vms.com',
    action: 'Camera Configuration Changed',
    resource: 'Camera',
    resourceId: 'CAM-001',
    status: 'success',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox 121.0',
    details: 'Updated camera resolution settings'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60000),
    user: 'jane.smith@vms.com',
    action: 'Failed Login Attempt',
    resource: 'Authentication',
    resourceId: 'auth-002',
    status: 'failed',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari 17.0',
    details: 'Invalid credentials provided'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 45 * 60000),
    user: 'admin@vms.com',
    action: 'User Role Updated',
    resource: 'User Management',
    resourceId: 'user-123',
    status: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0',
    details: 'Changed user role from Viewer to Operator'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 60 * 60000),
    user: 'system',
    action: 'AI Model Updated',
    resource: 'AI Model',
    resourceId: 'model-traffic-v2',
    status: 'success',
    ipAddress: 'internal',
    userAgent: 'System',
    details: 'Automatic model update to version 2.1.0'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 90 * 60000),
    user: 'john.doe@vms.com',
    action: 'Export Analytics Report',
    resource: 'Analytics',
    resourceId: 'report-001',
    status: 'success',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox 121.0',
    details: 'Exported weekly analytics report'
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 120 * 60000),
    user: 'admin@vms.com',
    action: 'System Settings Changed',
    resource: 'Configuration',
    resourceId: 'config-001',
    status: 'warning',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0',
    details: 'Changed retention policy from 30 to 90 days'
  }
]

export function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAction, setFilterAction] = useState<string>('all')

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus
    const matchesAction = filterAction === 'all' || log.action.includes(filterAction)
    
    return matchesSearch && matchesStatus && matchesAction
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <ShieldCheckIcon className="w-5 h-5 text-green-600" />
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
      default:
        return <CogIcon className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string): 'green' | 'red' | 'yellow' | 'zinc' => {
    switch (status) {
      case 'success':
        return 'green'
      case 'failed':
        return 'red'
      case 'warning':
        return 'yellow'
      default:
        return 'zinc'
    }
  }

  const handleExport = () => {
    // Simulate export
    alert('Exporting audit logs...')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading>Audit Logs</Heading>
        <Text className="mt-2">
          Track all system activities and user actions for security and compliance
        </Text>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </Select>
          </div>
          <div>
            <Select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
              <option value="all">All Actions</option>
              <option value="Login">Login</option>
              <option value="Configuration">Configuration</option>
              <option value="User">User Management</option>
              <option value="Export">Export</option>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button color="zinc" onClick={handleExport}>
            <ArrowDownTrayIcon />
            Export Logs
          </Button>
          <Button color="zinc">
            <FunnelIcon />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Total Events</Text>
              <Heading className="text-2xl mt-1">{mockAuditLogs.length}</Heading>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CogIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Success</Text>
              <Heading className="text-2xl mt-1 text-green-600">
                {mockAuditLogs.filter(l => l.status === 'success').length}
              </Heading>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Failed</Text>
              <Heading className="text-2xl mt-1 text-red-600">
                {mockAuditLogs.filter(l => l.status === 'failed').length}
              </Heading>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Warnings</Text>
              <Heading className="text-2xl mt-1 text-yellow-600">
                {mockAuditLogs.filter(l => l.status === 'warning').length}
              </Heading>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <Subheading>Recent Activity</Subheading>
          <Text className="mt-1 text-sm">
            Showing {filteredLogs.length} of {mockAuditLogs.length} logs
          </Text>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm">
                      {log.timestamp.toLocaleString()}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-zinc-400" />
                      <Text className="text-sm">{log.user}</Text>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm font-medium">{log.action}</Text>
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {log.details}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm">{log.resource}</Text>
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                      {log.resourceId}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <Badge color={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm">{log.ipAddress}</Text>
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                      {log.userAgent}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

