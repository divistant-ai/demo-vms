import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Button } from '../components/catalyst/button'
import { Select } from '../components/catalyst/select'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/catalyst/table'
import { analyticsApi } from '../services/api/analyticsApi'
import { format } from 'date-fns'

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

      {/* Schedule Reports Section */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Heading level={2}>Scheduled Reports</Heading>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Configure automatic report generation and delivery
        </p>
        <div className="mt-4">
          <Button plain>Add Schedule</Button>
        </div>
      </div>
    </div>
  )
}
