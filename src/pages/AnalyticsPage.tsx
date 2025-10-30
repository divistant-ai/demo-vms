import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Button } from '../components/catalyst/button'
import { Select } from '../components/catalyst/select'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { analyticsApi } from '../services/api/analyticsApi'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { format } from 'date-fns'
import { cameraApi } from '../services/api/cameraApi'
import { LoadingState } from '../utils/loadingStates'

export function AnalyticsPage() {
  const [filters, setFilters] = useState({
    location: 'all',
    type: 'all',
    period: '7d',
    camera: 'all',
    useCase: 'traffic',
  })

  const { data: timeSeries, isLoading: timeSeriesLoading } = useQuery({
    queryKey: ['analytics', 'timeseries'],
    queryFn: () => analyticsApi.getTimeSeries(7),
  })

  const { data: distribution, isLoading: distributionLoading } = useQuery({
    queryKey: ['analytics', 'distribution'],
    queryFn: () => analyticsApi.getDistribution(),
  })

  const { data: heatmap, isLoading: heatmapLoading } = useQuery({
    queryKey: ['analytics', 'heatmap'],
    queryFn: () => analyticsApi.getHeatmap(),
  })

  const { data: cameras } = useQuery({
    queryKey: ['cameras'],
    queryFn: () => cameraApi.getAll(),
  })

  const handleExport = () => {
    // Export analytics data to CSV
    const csvData = [
      ['Date', 'Traffic Incidents', 'Flood Alerts', 'Intrusions', 'Total'],
      ...(timeSeries || []).map(item => [
        format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm'),
        item.traffic_incidents,
        item.flood_alerts,
        item.intrusions,
        item.total
      ])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Heading>Analytics Dashboard</Heading>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Analyze trends and patterns across all video surveillance operations
              </p>
            </div>
            <Button onClick={handleExport} className="w-full sm:w-auto">Export</Button>
          </div>

      {/* Filter Panel */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Heading level={3}>Filters</Heading>
        <div className="mt-4">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Field>
                <Label>Use Case</Label>
                <Select value={filters.useCase} onChange={(e) => setFilters({ ...filters, useCase: e.target.value })}>
                  <optgroup label="Smart City">
                    <option value="traffic">Traffic Monitoring</option>
                    <option value="flood">Flood Detection</option>
                    <option value="crowd">Crowd Detection</option>
                    <option value="security">Security Monitoring</option>
                  </optgroup>
                  <optgroup label="ABL Logistics">
                    <option value="safety">Safety & HSE</option>
                    <option value="stevedoring">Stevedoring</option>
                    <option value="vessel-maintenance">Vessel Maintenance</option>
                    <option value="stockpile">Stockpile & Conveyor</option>
                    <option value="fleet-tracking">Fleet Tracking</option>
                  </optgroup>
                </Select>
              </Field>
              <Field>
                <Label>Location</Label>
                <Select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                  <option value="all">All Locations</option>
                  <optgroup label="Smart City">
                    <option value="downtown">Downtown</option>
                    <option value="river">River Area</option>
                    <option value="commercial">Commercial</option>
                  </optgroup>
                  <optgroup label="ABL Logistics">
                    <option value="berth">Berth Area</option>
                    <option value="crane">Crane Zone</option>
                    <option value="stockpile">Stockpile Area</option>
                    <option value="vessel">Vessel Area</option>
                  </optgroup>
                </Select>
              </Field>
              <Field>
                <Label>Event Type</Label>
                <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                  <option value="all">All Types</option>
                  <optgroup label="Smart City">
                    <option value="traffic">Traffic</option>
                    <option value="flood">Flood</option>
                    <option value="intrusion">Intrusion</option>
                  </optgroup>
                  <optgroup label="ABL Logistics">
                    <option value="safety">Safety Events</option>
                    <option value="cargo">Cargo Operations</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="efficiency">Efficiency</option>
                  </optgroup>
                </Select>
              </Field>
              <Field>
                <Label>Period</Label>
                <Select value={filters.period} onChange={(e) => setFilters({ ...filters, period: e.target.value })}>
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </Select>
              </Field>
              <Field>
                <Label>Camera</Label>
                <Select value={filters.camera} onChange={(e) => setFilters({ ...filters, camera: e.target.value })}>
                  <option value="all">All Cameras</option>
                  {cameras?.map((cam) => (
                    <option key={cam.id} value={cam.id}>{cam.name}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="mt-4">
              <Button onClick={() => {}}>Apply Filters</Button>
            </div>
          </FieldGroup>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Heading level={2}>Operational Events Over Time (7 days)</Heading>
        {timeSeriesLoading ? (
          <div className="mt-4">
            <LoadingState message="Loading chart data..." />
          </div>
        ) : timeSeries ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeSeries.map(item => ({
              date: format(new Date(item.timestamp), 'MMM dd'),
              traffic: item.traffic_incidents,
              flood: item.flood_alerts,
              intrusions: item.intrusions,
              total: item.total,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="traffic" stroke="#0066cc" name="Traffic" />
              <Line type="monotone" dataKey="flood" stroke="#ff3333" name="Flood" />
              <Line type="monotone" dataKey="intrusions" stroke="#ffcc00" name="Intrusions" />
              <Line type="monotone" dataKey="total" stroke="#8b5cf6" name="Total" />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Distribution Chart */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Heading level={2}>Incident Distribution</Heading>
          {distributionLoading ? (
            <div className="mt-4">
              <LoadingState message="Loading chart data..." />
            </div>
          ) : distribution ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Traffic', value: distribution.traffic_congestion },
                { name: 'Flood', value: distribution.flood_detection },
                { name: 'Intrusion', value: distribution.intrusion },
                { name: 'Crowd', value: distribution.crowd_detection },
                { name: 'Other', value: distribution.other },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0066cc" />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        {/* Heatmap */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Heading level={2}>Incident Heatmap</Heading>
          {heatmapLoading ? (
            <div className="mt-4">
              <LoadingState message="Loading heatmap data..." />
            </div>
          ) : heatmap ? (
            <div className="mt-4 space-y-3">
              {heatmap.map((point) => (
                <div key={point.location} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <div>
                    <div className="font-medium text-zinc-950 dark:text-white">{point.location}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {point.lat.toFixed(3)}, {point.lng.toFixed(3)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-zinc-200 rounded-full overflow-hidden dark:bg-zinc-800">
                      <div
                        className="h-full"
                        style={{ 
                          width: `${point.intensity * 100}%`,
                          backgroundColor: point.intensity > 0.7 ? '#ff3333' : point.intensity > 0.4 ? '#ffcc00' : '#0066cc'
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-zinc-950 dark:text-white">
                      {(point.intensity * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
