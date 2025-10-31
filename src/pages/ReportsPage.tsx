import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Select } from '../components/catalyst/select'
import { Badge } from '../components/catalyst/badge'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/catalyst/table'
import { analyticsApi } from '../services/api/analyticsApi'
import { format } from 'date-fns'

// Custom SVG Icons
function ChartBarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

function DocumentTextIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function ClockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CalendarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

// Mock Data
const mockReportTemplates = [
  {
    id: '1',
    name: 'Daily Operations Summary',
    description: 'Comprehensive daily report covering all incidents, alerts, and system performance',
    category: 'Operations',
    frequency: 'Daily',
    lastGenerated: new Date(Date.now() - 3600000),
    format: 'PDF',
    recipients: 5,
  },
  {
    id: '2',
    name: 'Weekly Security Audit',
    description: 'Security incidents, intrusion attempts, and access logs',
    category: 'Security',
    frequency: 'Weekly',
    lastGenerated: new Date(Date.now() - 86400000 * 2),
    format: 'PDF + CSV',
    recipients: 3,
  },
  {
    id: '3',
    name: 'Monthly Performance Report',
    description: 'System uptime, camera health, AI model accuracy, and KPIs',
    category: 'Performance',
    frequency: 'Monthly',
    lastGenerated: new Date(Date.now() - 86400000 * 15),
    format: 'PDF',
    recipients: 8,
  },
  {
    id: '4',
    name: 'Traffic Analysis Report',
    description: 'Traffic patterns, congestion hotspots, and incident trends',
    category: 'Traffic',
    frequency: 'Weekly',
    lastGenerated: new Date(Date.now() - 86400000 * 5),
    format: 'PDF + Excel',
    recipients: 4,
  },
  {
    id: '5',
    name: 'Compliance Report',
    description: 'GDPR compliance, data retention, and audit trail',
    category: 'Compliance',
    frequency: 'Monthly',
    lastGenerated: new Date(Date.now() - 86400000 * 10),
    format: 'PDF',
    recipients: 6,
  },
]

const mockScheduledReports = [
  {
    id: '1',
    template: 'Daily Operations Summary',
    schedule: 'Every day at 8:00 AM',
    nextRun: new Date(Date.now() + 3600000 * 12),
    status: 'active',
    recipients: ['ops@company.com', 'manager@company.com'],
  },
  {
    id: '2',
    template: 'Weekly Security Audit',
    schedule: 'Every Monday at 9:00 AM',
    nextRun: new Date(Date.now() + 86400000 * 2),
    status: 'active',
    recipients: ['security@company.com'],
  },
  {
    id: '3',
    template: 'Monthly Performance Report',
    schedule: '1st of every month at 10:00 AM',
    nextRun: new Date(Date.now() + 86400000 * 20),
    status: 'active',
    recipients: ['ceo@company.com', 'cto@company.com'],
  },
  {
    id: '4',
    template: 'Traffic Analysis Report',
    schedule: 'Every Friday at 5:00 PM',
    nextRun: new Date(Date.now() + 86400000 * 3),
    status: 'paused',
    recipients: ['traffic@company.com'],
  },
]

export function ReportsPage() {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d'>('7d')
  const { data: timeSeries } = useQuery({
    queryKey: ['analytics', 'timeseries'],
    queryFn: () => analyticsApi.getTimeSeries(7),
  })

  const handleExportCSV = () => {
    if (!timeSeries) return
    
    const csv = [
      ['Date', 'Traffic Incidents', 'Flood Alerts', 'Intrusions', 'Total'],
      ...timeSeries.map((item) => [
        format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm'),
        item.traffic_incidents.toString(),
        item.flood_alerts.toString(),
        item.intrusions.toString(),
        item.total.toString(),
      ]),
    ].map((row) => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vms-report-${dateRange}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Reports</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Generate and manage reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onChange={(e) => setDateRange(e.target.value as '24h' | '7d' | '30d')}>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </Select>
          <Button plain onClick={handleExportCSV}>Export CSV</Button>
          <Button onClick={handleExportPDF}>Export PDF</Button>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Incidents</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
            {timeSeries?.reduce((sum, item) => sum + item.total, 0) || 0}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Traffic Incidents</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
            {timeSeries?.reduce((sum, item) => sum + item.traffic_incidents, 0) || 0}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Flood Alerts</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
            {timeSeries?.reduce((sum, item) => sum + item.flood_alerts, 0) || 0}
          </div>
        </div>
      </div>

      {/* Report Table */}
      {timeSeries && (
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Date & Time</TableHeader>
                <TableHeader>Traffic Incidents</TableHeader>
                <TableHeader>Flood Alerts</TableHeader>
                <TableHeader>Intrusions</TableHeader>
                <TableHeader>Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSeries.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{item.traffic_incidents}</TableCell>
                  <TableCell>{item.flood_alerts}</TableCell>
                  <TableCell>{item.intrusions}</TableCell>
                  <TableCell className="font-medium">{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Report Templates */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Subheading>Report Templates</Subheading>
            <Text className="mt-1">Pre-configured report templates for quick generation</Text>
          </div>
          <Button plain>Create Template</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockReportTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-950 dark:text-white">{template.name}</div>
                    <Text className="text-xs">{template.category}</Text>
                  </div>
                </div>
                <Badge color="zinc">{template.frequency}</Badge>
              </div>
              
              <Text className="text-sm mb-4">{template.description}</Text>
              
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>Last: {format(template.lastGenerated, 'MMM dd, HH:mm')}</span>
                </div>
                <div>{template.recipients} recipients</div>
              </div>
              
              <div className="flex gap-2">
                <Button plain className="flex-1">Generate Now</Button>
                <Button plain>Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Subheading>Scheduled Reports</Subheading>
            <Text className="mt-1">Automatic report generation and delivery</Text>
          </div>
          <Button plain>Add Schedule</Button>
        </div>

        <div className="space-y-4">
          {mockScheduledReports.map((schedule) => (
            <div
              key={schedule.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-zinc-950 dark:text-white">{schedule.template}</div>
                    <Badge color={schedule.status === 'active' ? 'green' : 'zinc'}>
                      {schedule.status}
                    </Badge>
                  </div>
                  <Text className="text-sm">{schedule.schedule}</Text>
                  <Text className="text-xs mt-1">
                    Next run: {format(schedule.nextRun, 'MMM dd, yyyy HH:mm')}
                  </Text>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button plain>{schedule.status === 'active' ? 'Pause' : 'Resume'}</Button>
                <Button plain>Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report History Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-blue-600" />
            <div>
              <Text className="text-xs">Reports Generated</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">247</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="w-8 h-8 text-green-600" />
            <div>
              <Text className="text-xs">Active Templates</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">5</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-purple-600" />
            <div>
              <Text className="text-xs">Scheduled Reports</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">4</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-8 h-8 text-amber-600" />
            <div>
              <Text className="text-xs">Avg. Generation Time</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">2.3s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
